exports.validateSchema =
  (schema, target = 'body') =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req[target]);
      next();
    } catch (err) {
      next(err);
    }
  };
