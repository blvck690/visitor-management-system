export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = result.error.flatten();
    return next(err);
  }
  req.body = result.data;
  next();
};