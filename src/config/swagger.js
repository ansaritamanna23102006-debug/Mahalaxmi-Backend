const swaggerJSDoc = require('swagger-jsdoc');

const getSwaggerSpecs = () => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Mahalaxmi Mithaiwala API Docs',
        version: '1.0.0',
        description: 'Complete backend API for Mahalaxmi Mithaiwala Ecommerce platform (Since 1982)',
        contact: {
          name: 'Support Team',
          email: 'admin@mahalaxmimithaiwala.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:5000/api/v1',
          description: 'Development Server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT access token'
          }
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              fullName: { type: 'string' },
              email: { type: 'string' },
              mobileNumber: { type: 'string' },
              profilePhoto: { type: 'string' },
              role: { type: 'string', enum: ['user', 'admin'] },
              isVerified: { type: 'boolean' }
            }
          },
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string' },
              category: { type: 'string' },
              description: { type: 'string' },
              shortDescription: { type: 'string' },
              price: { type: 'number' },
              discountPrice: { type: 'number' },
              stock: { type: 'number' },
              sku: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } },
              weightOptions: { type: 'array', items: { type: 'string' } },
              ratings: { type: 'number' },
              reviewsCount: { type: 'number' }
            }
          },
          Cart: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    product: { type: 'string' },
                    quantity: { type: 'number' },
                    weight: { type: 'string' },
                    price: { type: 'number' }
                  }
                }
              },
              subtotal: { type: 'number' },
              discount: { type: 'number' },
              shippingCharge: { type: 'number' },
              total: { type: 'number' }
            }
          },
          Order: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderId: { type: 'string' },
              items: { type: 'array', items: { type: 'object' } },
              shippingAddress: { type: 'object' },
              subtotal: { type: 'number' },
              discountAmount: { type: 'number' },
              shippingCharge: { type: 'number' },
              total: { type: 'number' },
              paymentMethod: { type: 'string' },
              paymentStatus: { type: 'string' },
              orderStatus: { type: 'string' }
            }
          }
        }
      },
      paths: {
        '/auth/register': {
          post: {
            tags: ['Authentication'],
            summary: 'Register a new customer',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['fullName', 'email', 'mobileNumber', 'password'],
                    properties: {
                      fullName: { type: 'string', example: 'Sneha Kapoor' },
                      email: { type: 'string', example: 'sneha@example.com' },
                      mobileNumber: { type: 'string', example: '9876543210' },
                      password: { type: 'string', example: 'password123' }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'User registered successfully' },
              400: { description: 'Invalid payload details' }
            }
          }
        },
        '/auth/login': {
          post: {
            tags: ['Authentication'],
            summary: 'Login customer credentials',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                      email: { type: 'string', example: 'sneha@example.com' },
                      password: { type: 'string', example: 'password123' }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Logged in and token returned' },
              401: { description: 'Unauthorized check' }
            }
          }
        },
        '/products': {
          get: {
            tags: ['Products'],
            summary: 'Fetch and filter product catalog',
            parameters: [
              { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category name (e.g. Sweets)' },
              { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keywords' },
              { name: 'sort', in: 'query', schema: { type: 'string' }, description: 'Sort criteria (priceAsc, priceDesc, rating)' },
              { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Page number' }
            ],
            responses: {
              200: { description: 'Returns catalog matching queries' }
            }
          }
        },
        '/products/slug/{slug}': {
          get: {
            tags: ['Products'],
            summary: 'Get product profile by slug',
            parameters: [
              { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'kaju-katli' }
            ],
            responses: {
              200: { description: 'Product profile' },
              404: { description: 'Product not found' }
            }
          }
        },
        '/cart': {
          get: {
            tags: ['Shopping Cart'],
            summary: 'Get active basket items',
            parameters: [
              { name: 'couponCode', in: 'query', schema: { type: 'string' } }
            ],
            responses: {
              200: { description: 'Returns items lists and price summaries' }
            }
          },
          post: {
            tags: ['Shopping Cart'],
            summary: 'Sync and overwrite whole cart array',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      items: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Cart synced successfully' }
            }
          }
        },
        '/orders': {
          post: {
            tags: ['Orders & Checkouts'],
            summary: 'Checkout cart and create order',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['items', 'shippingAddress', 'paymentMethod'],
                    properties: {
                      paymentMethod: { type: 'string', enum: ['upi', 'card', 'net', 'cod'] },
                      shippingAddress: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          mobile: { type: 'string' },
                          addressLine: { type: 'string' },
                          pincode: { type: 'string' }
                        }
                      },
                      items: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'Order created' }
            }
          }
        }
      }
    },
    apis: [] // Explicitly defined specs locally
  };

  return swaggerJSDoc(options);
};

module.exports = {
  getSwaggerSpecs
};
