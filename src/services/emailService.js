const nodemailer = require('nodemailer');

const getTransporter = () => {
  const isMock = process.env.SMTP_USER === 'mock_user' || !process.env.SMTP_USER;

  if (isMock) {
    console.log('[MOCK SMTP] Email transporter configured in log-only simulation mode.');
    return {
      sendMail: async (mailOptions) => {
        console.log('============================================================');
        console.log(`[MOCK EMAIL SENT]`);
        console.log(`From: ${mailOptions.from}`);
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body Snippet: ${mailOptions.text || mailOptions.html.substring(0, 300)}...`);
        console.log('============================================================');
        return { messageId: `mock_email_id_${Date.now()}` };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Mahalaxmi Mithaiwala'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@mahalaxmimithaiwala.com'}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// 1. Verification Email
const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0cda7; border-radius: 12px; padding: 24px; background-color: #fcf9f2;">
      <h2 style="color: #6a1a18; text-align: center; border-bottom: 2px solid #e0cda7; padding-bottom: 12px;">Welcome to Mahalaxmi Mithaiwala</h2>
      <p>Namaste <strong>${name}</strong>,</p>
      <p>Thank you for registering an account with us. We have been serving sweet happiness since 1982. Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #6a1a18; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="font-size: 12px; color: #555;">Or copy and paste this link in your browser: <br/> ${verifyUrl}</p>
      <p style="border-top: 1px solid #e0cda7; padding-top: 15px; font-size: 12px; color: #888; text-align: center;">Mahalaxmi Mithaiwala (Since 1982) <br/> Opp. L Ward Office, CST Road, Kurla (W), Mumbai</p>
    </div>
  `;
  return await sendEmail({ to, subject: 'Verify Your Email Address - Mahalaxmi Mithaiwala', html });
};

// 2. Password Reset Email
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0cda7; border-radius: 12px; padding: 24px; background-color: #fcf9f2;">
      <h2 style="color: #6a1a18; text-align: center; border-bottom: 2px solid #e0cda7; padding-bottom: 12px;">Reset Your Password</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>You are receiving this email because you (or someone else) requested a password reset for your account. Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #6a1a18; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #555;">This link will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
      <p style="border-top: 1px solid #e0cda7; padding-top: 15px; font-size: 12px; color: #888; text-align: center;">Mahalaxmi Mithaiwala (Since 1982) <br/> Opp. L Ward Office, CST Road, Kurla (W), Mumbai</p>
    </div>
  `;
  return await sendEmail({ to, subject: 'Password Reset Request - Mahalaxmi Mithaiwala', html });
};

// 3. Contact Form Submission Notification
const sendContactFormNotification = async (contactData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mahalaxmimithaiwala.com';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0cda7; border-radius: 12px; padding: 24px; background-color: #fcf9f2;">
      <h2 style="color: #6a1a18; border-bottom: 2px solid #e0cda7; padding-bottom: 12px;">New Customer Inquiry</h2>
      <p>A user has submitted a support inquiry on the website contact form.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7; font-weight: bold;">Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7;">${contactData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7;">${contactData.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7; font-weight: bold;">Mobile:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7;">${contactData.mobile}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7; font-weight: bold;">Subject:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e0cda7;">${contactData.subject}</td>
        </tr>
      </table>
      <p><strong>Message:</strong></p>
      <div style="background-color: #fff; border: 1px solid #e0cda7; border-radius: 6px; padding: 15px; font-style: italic;">
        ${contactData.message}
      </div>
      <p style="margin-top: 20px; font-size: 11px; color: #888;">This inquiry is stored in the database. Log in to your admin panel to manage inquiries.</p>
    </div>
  `;
  return await sendEmail({ to: adminEmail, subject: `[SUPPORT INQUIRY] ${contactData.subject}`, html });
};

// 4. Order Confirmation Invoice Email
const sendOrderConfirmationEmail = async (to, order) => {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0cda7; border-radius: 12px; padding: 24px; background-color: #fcf9f2;">
      <div style="text-align: center; border-bottom: 2px solid #e0cda7; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #6a1a18; margin: 0;">Mahalaxmi Mithaiwala</h2>
        <span style="font-size: 12px; color: #888;">Serving Sweet Happiness Since 1982</span>
      </div>
      <h3 style="color: #6a1a18; text-align: center;">Order Invoice & Confirmation</h3>
      <p>Namaste,</p>
      <p>Thank you for shopping with us! Your order <strong>${order.orderId}</strong> has been successfully placed.</p>
      
      <div style="background-color: #fff; padding: 15px; border: 1px solid #e0cda7; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0;"><strong>Order Status:</strong> ${order.orderStatus.toUpperCase()}</p>
        <p style="margin: 0 0 8px 0;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p style="margin: 0;"><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
      </div>

      <h4 style="color: #6a1a18; margin-bottom: 10px; border-bottom: 1px solid #e0cda7; padding-bottom: 5px;">Items Ordered</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #eee;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <table style="width: 50%; float: right; margin-bottom: 20px; font-weight: bold;">
        <tr>
          <td style="padding: 5px;">Subtotal:</td>
          <td style="padding: 5px; text-align: right;">₹${order.subtotal}</td>
        </tr>
        ${order.discountAmount > 0 ? `
        <tr style="color: #6a1a18;">
          <td style="padding: 5px;">Discount:</td>
          <td style="padding: 5px; text-align: right;">- ₹${order.discountAmount}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 5px;">Shipping:</td>
          <td style="padding: 5px; text-align: right;">₹${order.shippingCharge}</td>
        </tr>
        <tr style="font-size: 16px; color: #b8860b; border-top: 1px solid #e0cda7;">
          <td style="padding: 8px 5px;">Grand Total:</td>
          <td style="padding: 8px 5px; text-align: right;">₹${order.total}</td>
        </tr>
      </table>
      <div style="clear: both;"></div>

      <h4 style="color: #6a1a18; margin-top: 20px; border-bottom: 1px solid #e0cda7; padding-bottom: 5px;">Shipping Destination</h4>
      <p style="margin: 5px 0;"><strong>${order.shippingAddress.name}</strong></p>
      <p style="margin: 5px 0;">Phone: ${order.shippingAddress.mobile}</p>
      <p style="margin: 5px 0;">${order.shippingAddress.addressLine}, ${order.shippingAddress.landmark ? order.shippingAddress.landmark + ', ' : ''}${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>

      <p style="border-top: 1px solid #e0cda7; padding-top: 15px; font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
        For support or modifications, reply to this email or call Opp. L Ward Office, Kurla (W), Mumbai.
      </p>
    </div>
  `;
  return await sendEmail({ to, subject: `Order Confirmed: ${order.orderId} - Mahalaxmi Mithaiwala`, html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendContactFormNotification,
  sendOrderConfirmationEmail
};
