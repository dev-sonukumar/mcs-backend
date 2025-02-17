const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  console.error("🔍 Stack:", err.stack);

  const statusCode = err.status || 500;

  // Hide detailed errors in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message;

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
