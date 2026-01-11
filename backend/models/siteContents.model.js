const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Content key is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Key is too short"],
      maxlength: [64, "Key is too long"],
    },
    format: {
      type: String,
      enum: {
        values: ["markdown", "text"],
        message: '"{VALUE}" is not a supported format.',
      },
      default: "markdown",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      default: "",
      maxlength: [200000, "Content is too large"],
    },
  },
  { timestamps: true }
);

const siteContent = mongoose.model("siteContents", siteContentSchema);
module.exports = siteContent;