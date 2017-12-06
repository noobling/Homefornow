var mongoose = require( 'mongoose' );

var addressSchema = new mongoose.Schema({
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
    beds: [bedSchema]
});

mongoose.model('accomodation', accomodationSchema);
