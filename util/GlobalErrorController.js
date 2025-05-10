const AppError = require("./AppError");

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`Duplicate value for '${field}': '${value}'. Please use a different value.`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map(e => e.message);
  return new AppError(`Invalid input: ${messages.join(". ")}`, 400);
};

module.exports = (err, req, res, next) => {
  // console.error("Error:", err);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  const dupError = err.code === 11000 ? err
    : err.cause && err.cause.code === 11000 ? err.cause
    : null;

  if (dupError) err = handleDuplicateFieldsError(dupError);
  if (err.name === "ValidationError") err = handleValidationError(err);

  res.status(err.statusCode).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
};
