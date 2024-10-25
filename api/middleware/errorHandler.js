const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Failed to process request.",
    message: err.message,
  });
};

module.exports = errorHandler;
