var mongoose = require( 'mongoose' );

var bedSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Either']
    },
    isDisability: {
        type: Boolean,
        required: false
    },
    bedType: {
        type: String,
        required: false,
        enum: ['Single', 'parentChild', 'Couple', 'Family']
    },
    taken: {
        type: Boolean,
        required: true
    }
});
