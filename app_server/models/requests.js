var mongoose = require( 'mongoose' );

var requestSchema = new mongoose.Schema({
    //Name
    name: {
        type: String,
        required: true
    },
    //Gender
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Either']
    },
    //Age
    age: {
        type: Number,
        required: true,
    },
    //Phone Number
    phoneNumber: {
        type: String,
        required: true
    },
    //Does the youth have a disability
    hasDisability: {
        type: Boolean,
        required: true
    },
    //Child
    hasChild: {
        type: Boolean,
        required: true
    },
    //True if requesting long term accommodation, false otherwise
    isLongTerm: {
        type: Boolean,
        required: true
    }
});

mongoose.model('Request', requestSchema);
