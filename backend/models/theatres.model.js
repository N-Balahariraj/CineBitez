const mongoose = require('mongoose');
const validator = require('validator');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies', 
        required: true
    },
    languages: {
        type: [String],
        required: [true, 'At least one language is required for a show.'],
        lowercase: true,
        trim: true
    },
    shows: {
        type: [String],
        required: [true, 'At least one show time is required.'],
        validate: {
            validator: function(arr) {
                // This regex checks for a "HH:MM AM/PM" format
                return arr.every(time => /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(time));
            },
            message: 'All show times must be in a valid HH:MM AM/PM format.'
        }
    }
}, { _id: false }); 

const theatreSchema = new mongoose.Schema({
    id: { 
        type: Number,
        unique: true,
        required: [true, 'Theatre ID is required.'],
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
        trim: true,
        validate: [validator.isURL, 'Please provide a valid URL for the background image.']
    },
    pics: { 
        type: [String],
        validate: {
            validator: function(arr) {
                return arr.every(url => validator.isURL(url));
            },
            message: 'All picture URLs must be valid.'
        }
    },
    movies: [showSchema] 
}, {
    timestamps: true, 
    toJSON: { getters: true },
    toObject: { getters: true }
});

// --- Indexing ---
theatreSchema.index({ name: 1 });
theatreSchema.index({ location: 'text' });


const theatre = mongoose.model('theatres', theatreSchema);

module.exports = theatre;
