const mongoose = require('mongoose');
const validator = require('validator'); // For URL validation

const movieSchema = new mongoose.Schema({
    id: { 
        type: String, 
        unique: true,
        required: [true, 'Movie ID is required.'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Movie poster URL is required.'],
        trim: true,
        validate: [validator.isURL, 'Please provide a valid URL for the image.']
    },
    movie: {
        type: String,
        required: [true, 'Movie title is required.'],
        trim: true,
        maxlength: [100, 'Movie title cannot exceed 100 characters.'],
        unique: true 
    },
    languages: {
        type: [String],
        required: [true, 'At least one language is required.'],
        enum: {
            values: ['Tamil', 'Telugu', 'Hindi', 'Kannada', 'English', 'Malayalam', 'Bengali', 'Marathi'], // Extend as needed
            message: '"{VALUE}" is not a supported language.'
        },
        lowercase: true,
        trim: true
    },
    genres: {
        type: [String],
        required: [true, 'At least one genre is required.'],
        enum: {
            values: ['Action', 'Comedy', 'Period', 'Drama', 'Thriller', 'Horror', 'Sci-Fi', 'Fantasy', 'Romance', 'Animation'], // Extend as needed
            message: '"{VALUE}" is not a supported theme/genre.'
        },
        trim: true
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be less than 0.'],
        max: [10, 'Rating cannot be more than 10.'],
        default: 0,
        set: v => Math.round(v * 10) / 10 
    },
    votes: { 
        type: Number,
        default: 0,
        set: function(v) {
            if (typeof v === 'string') {
                const num = parseFloat(v.replace('K', '')) * 1000;
                return isNaN(num) ? 0 : num;
            }
            return v;
        },
        get: function(v) {
            if (v >= 1000) {
                return (v / 1000).toFixed(1) + 'K';
            }
            return v.toString();
        }
    },
    price: { 
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price cannot be negative.'],
        get: v => (v / 100).toFixed(2),
        set: v => Math.round(v * 100)
    },
    pics: { 
        type: [String],
        validate: {
            validator: function(arr) {
                return arr.every(url => validator.isURL(url));
            },
            message: 'All additional pictures must be valid URLs.'
        }
    },
    trailers: {
        type: [String], 
        validate: {
            validator: function(arr) {
                return arr.every(url => validator.isURL(url) && (url.includes('youtube.com') || url.includes('youtu.be')));
            },
            message: 'All trailers must be valid YouTube URLs.'
        }
    },
    theatres: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theatres' 
    }]
}, {
    timestamps: true, 
    toJSON: { getters: true },
    toObject: { getters: true }
});

// --- Indexing ---
movieSchema.index({ movie: 1 });
movieSchema.index({ languages: 1 });


const movie = mongoose.model('movies', movieSchema);

module.exports = movie;
