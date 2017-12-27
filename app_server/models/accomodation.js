var mongoose = require( 'mongoose' );

var addressSchema = new mongoose.Schema({
  //Appartment number or Unit number
    unitNumber: {
        type : Number,
        required : false
    },
    //Street number
    streetNumber: {
        type : Number,
        required: true,
        min: 1
    },
    //Street name
    streetName: {
        type: String,
        required: true
    },
    //Suburb
    suburb: {
        type: String,
        required: true
    },
    //Postcode
    postcode: {
        type: Number,
        required: true,
        min: 1
    },
    //State
    state: {
        type: String,
        required: true
    }
});

var bedSchema = new mongoose.Schema({
  //Beds avaialable for the gender
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Either']
    },
    //Is the bed disability-friendly, add a description field for type of disability later?
    isDisability: {
        type: Boolean,
        required: false
    },
    //Is the bed for the folowing enum?
    bedType: {
        type: String,
        required: false,
        enum: ['Single', 'parentChild', 'Couple', 'Family']
    },
    //Is the bed taken
    taken: {
        type: Boolean,
        required: true
    }
});

//Age range for the accommodation
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
    //Accomodation ID
    id : {
        type: String,
        unique: true,
        required: true
    },
    //Accomodation name
    name : {
        type : String,
        unique : false,
        required : true
    },
    //Accomodation address
    address: {
        type: addressSchema,
        required: true
    },
    //Accomodation phone number
    phoneNumber: {
        type: String,
        required: true
    },
    //Average length of stay for the user, in weeks
    stayLength: {
        type: Number,
        required: true
    },
    //Accomodation age range for stay
    ageRange: {
        type: ageSchema,
        required: true
    },
    //Accomodation bed details, as an array
    beds: [bedSchema],
    //Timestamp for last updated
    updated: {
      type: Number,
      required: true
    },
    //Website links to the accomodation (if they have any)
    website: {
      type: String,
      required: false
    }
});

mongoose.model('accomodation', accomodationSchema);
