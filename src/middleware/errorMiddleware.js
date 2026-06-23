const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak details
    console.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose Specific Errors
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // 1. Mongoose Bad ObjectId (CastError)
  if (error.name === 'CastError') {
    error.message = `Resource not found with id of ${error.value}`;
    error.statusCode = 400;
    error.isOperational = true;
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate field value entered: '${value}'. Please use another value!`;
    error.statusCode = 400;
    error.isOperational = true;
  }

  // 3. Mongoose Validation Error
  if (error.name === 'ValidationError') {
    if (err.errors) {
      const messages = Object.values(err.errors).map((val) => val.message);
      error.message = `Invalid input data: ${messages.join('. ')}`;
    }
    error.statusCode = 400;
    error.isOperational = true;
  }

  // 4. JWT Web Token Errors
  if (error.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again!';
    error.statusCode = 401;
    error.isOperational = true;
  }

  if (error.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again!';
    error.statusCode = 401;
    error.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
