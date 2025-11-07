const mongoose = require('mongoose');
const validator = require('validator'); // For URL validation

const movieSchema = new mongoose.Schema({
    id: { 
        type: Number, 
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
            values: ['Action', 'Comedy', 'Period', 'Drama', 'Thriller', 'Horror', 'Sci-Fi', 'Fantasy', 'Romance', 'Animation', 'Crime', 'Adventure', 'Musical'], // Extend as needed
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
        set: v => {
            if(!v) return;
            if(v?.includes('K') || v?.includes('k')) return parseFloat(v) * 1_000;
            if( v?.includes('M') || v?.includes('m')) return parseFloat(v) * 1_000_000;
            return parseFloat(v);
        },
        get: v => {
            if(!v) return;
            if(Math.floor(v / 1_000_000)) return (v/1_000_000).toFixed(2)+"M";
            if(Math.floor(v / 1_000)) return (v/1_000).toFixed(2)+"K";
            return v+""
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
                return arr.every(url => validator.isURL(url));
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


const movie = mongoose.model('movies', movieSchema);

module.exports = movie;
