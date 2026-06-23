const validationMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    if (!dataToValidate) {
      const err = new Error('No request data found to validate');
      err.statusCode = 400;
      return next(err);
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join('. ');
      const valError = new Error(messages);
      valError.statusCode = 400;
      valError.name = 'ValidationError';
      return next(valError);
    }

    // Reassign validated and stripped value back to request
    req[source] = value;
    next();
  };
};

module.exports = validationMiddleware;
