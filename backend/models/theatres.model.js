const mongoose = require('mongoose');
const validator = require('validator');

const hallSchema = new mongoose.Schema(
  {
    hallId: {
      type: String,
      required: [true, "Hall ID is required."],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: "standard",
    },
    // Example: ["AAAA_AAAA", "BBBB_BBBB"] where "_" is aisle
    layoutTemplate: {
      type: [String],
      required: [true, "layoutTemplate is required."],
      validate: {
        validator: function (arr) {
          if (!Array.isArray(arr) || arr.length === 0) return false;
          // Ensure all rows are strings and same length
          const len = arr[0]?.length ?? 0;
          if (len === 0) return false;
          return arr.every(
            (row) =>
              typeof row === "string" &&
              row.length === len &&
              /^[A-Za-z_]+$/.test(row)
          );
        },
        message:
          "layoutTemplate must be a non-empty array of equal-length strings containing only letters and '_'",
      },
    },
  },
  { _id: false }
);

const theatreSchema = new mongoose.Schema({
    id: { 
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Theatre name is required.'],
        trim: true,
        unique: true,
        maxlength: [150, 'Theatre name cannot exceed 150 characters.']
    },
    rating: { 
        type: Number,
        min: [0, 'Rating cannot be less than 0.'],
        max: [10, 'Rating cannot be more than 10.'],
        default: 0,
        set: v => Math.round(v * 10) / 10 
    },
    price: { 
        type: Number,
        required: [true, 'A base price is required.'],
        min: [0, 'Price cannot be negative.'],
        get: v => (v / 100).toFixed(2), 
        set: v => Math.round(v * 100)  
    },
    location: {
        type: String,
        required: [true, 'Location is required.'],
        trim: true,
        maxlength: [300, 'Location string cannot exceed 300 characters.']
    },
    bg: { 
        type: String,
        required: [true, 'Background image URL is required.'],
    },
    pics: { 
        type: [String],
        default: [],
    },

    // Blueprint: one theatre can have multiple halls
    halls: {
        type: [hallSchema],
        default: [],
    }
}, {
    timestamps: true, 
    toJSON: { getters: true },
    toObject: { getters: true }
});

// --- Indexing ---
theatreSchema.index({ location: 'text' });


const theatre = mongoose.model('theatres', theatreSchema);

module.exports = theatre;
