var mongoose = require( 'mongoose' );
var bed = require('bed');

var addressSchema new mongoose.Schema({
    appartmentNumber: {
        type : Number,
        required : false
    },
    streetNumber: {
        type : Number,
        required: true,
        min: 1
    },
    streetName: {
        type: String,
        required: true
    },
    suburb: {
        type: String,
        required: true
    },
    postcode: {
        type: Number,
        required: true,
        min: 1
    }
});

var ageSchema = new mongoose.Schema({
    minAge: {
        type: Number,
        required: true
    },
    maxAge: {
        type: Number,
        required: true
    }
});

var accomodationSchema = new mongoose.Schema({
    id : {
        type: String,
        unique: true,
        required: true
    },
    name : {
        type : String,
        unique : false,
        required : true
    },
    address: {
        type: addressSchema,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    stayLength: {
        type: Number,
        required: true
    },
    ageRange: {
        type: ageSchema,
        required: true
    },
    beds: [bed.bedSchema]
});

mongoose.model('accomodation', accomodationSchema);
