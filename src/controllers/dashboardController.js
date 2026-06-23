const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get high level KPIs for admin dashboard overview
exports.getKPIs = async (req, res, next) => {
  try {
    // 1. Total Paid Revenue
    const revenueAggregation = await Order.aggregate([
      { $match: { paymentStatus: 'paid', orderStatus: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    // 2. Total Orders count
    const totalOrders = await Order.countDocuments();

    // 3. Total Registered Customers count
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // 4. Total Products count
    const totalProducts = await Product.countDocuments();

    // 5. Best Selling Items (marked as best seller)
    const bestSellers = await Product.find({ isBestSeller: true }).limit(5);

    // 6. Low Stock Alert Products (stock < 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select('name stock price sku');

    // 7. Today's Daily Orders (from midnight)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dailyOrdersCount = await Order.countDocuments({ createdAt: { $gte: startOfToday } });

    res.status(200).json({
      status: 'success',
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        dailyOrdersCount,
        bestSellersCount: bestSellers.length,
        bestSellers,
        lowStockProductsCount: lowStockProducts.length,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Detailed Analytics & Reports (Sales, Categories, and Customer Growth)
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 1. Monthly Sales Revenue Aggregation for current year
    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          orderStatus: { $nin: ['cancelled', 'refunded'] },
          createdAt: { $gte: new Date(`${currentYear}-01-01`) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$total' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Format monthly sales results (1-12 mapping)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlySales = Array.from({ length: 12 }, (_, i) => {
      const found = monthlySales.find(m => m._id === (i + 1));
      return {
        month: months[i],
        revenue: found ? found.revenue : 0,
        orders: found ? found.ordersCount : 0
      };
    });

    // 2. Top Products Sold (calculated by summing order items quantity)
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled', 'refunded'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          quantitySold: { $sum: '$items.quantity' },
          totalSalesValue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    // 3. Top Categories Revenue Distribution
    // To associate categories, we look up the product fields
    const topCategories = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled', 'refunded'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // 4. Customer Signups Growth (Grouped by month for the current year)
    const customerGrowth = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: new Date(`${currentYear}-01-01`) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const formattedCustomerGrowth = Array.from({ length: 12 }, (_, i) => {
      const found = customerGrowth.find(c => c._id === (i + 1));
      return {
        month: months[i],
        newSignups: found ? found.count : 0
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        year: currentYear,
        monthlySales: formattedMonthlySales,
        topProducts,
        topCategories,
        customerGrowth: formattedCustomerGrowth
      }
    });
  } catch (error) {
    next(error);
  }
};
