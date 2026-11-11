export const sendError = (res, error, label) => {
  console.error(`${label}:`, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier provided" });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {}).join(", ");
    return res.status(409).json({
      message: `A record with this ${field || "value"} already exists`,
    });
  }

  return res.status(500).json({
    message: "Something Went Wrong, Please Contact Support",
  });
};
