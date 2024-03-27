exports.validateSchema =
  (schema, target = 'body') =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req[target], { allowUnknown: true });
      next();
    } catch (err) {
      next(err);
    }
  };
