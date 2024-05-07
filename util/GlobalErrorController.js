const AppError = require("./AppError");

module.exports = (err, req, res, next) => {
  // console.log(err.statusCode);

  console.log(`Error found -> ${err}`);

  // console.log(err.code)


  err.statusCode = err.statusCode || 500;

  err.message = err.message || "Internal Server error";

  if (err.code === 11000) err = handleDuplicateFieldsError(err);

  res.status(err.statusCode).json({
    status: err.statusCode,
    // error: err,
    message:err.message
  });
};

const handleDuplicateFieldsError = (err) => {
  // console.log(err);
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];
  const errorMessage = `Duplicate title value: ${duplicateValue}. Please use a different title.`;

  return new AppError(errorMessage, 400)
};