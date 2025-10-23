const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // --- Core Identity Fields ---
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long."],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
      ],
    },

    // --- Profile Information ---
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [150, "Bio cannot exceed 150 characters."],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters."],
    },

    // --- Social Media Links ---
    socials: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },

    // --- Personalization Settings ---
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"], // Only allows these two values
        default: "dark",
      },
      sound: {
        enabled: { type: Boolean, default: true },
        volume: {
          type: Number,
          min: 0,
          max: 100,
          default: 80,
        },
      },
    },

    // --- System & Role Fields ---
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    // --- Schema Options ---
    timestamps: true,
  }
);

// --- PASSWORD HASHING MIDDLEWARE ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// --- PASSWORD COMPARISON METHOD ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } 
  catch (err) {
    throw err;
  }
};

const user = mongoose.model("users", userSchema);

module.exports = user;
