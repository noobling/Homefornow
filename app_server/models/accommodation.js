var mongoose = require( 'mongoose' );

var addressSchema = new mongoose.Schema({
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
    },
    //Latitude
    lat: {
        type: String,
        required: true
    },
    //Longitude
    long: {
        type: String,
        required: true
    }
});

var tagSchema = new mongoose.Schema({
    //Name of the tag
    name: {
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
    //Is the bed for the following enum?
    bedType: {
        type: String,
        required: false,
        enum: ['Single', 'ParentChild', 'Couple', 'Family']
    },
    //Is the bed occupied
    occupied: {
        type: Boolean,
        required: true
    },
    //User creatable tags that describe the bed, as an array
    tags: {
        type: [tagSchema],
        required: false
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

var accommodationSchema = new mongoose.Schema({
    //Accommodation ID
    id: {
        type: String,
        unique: true,
        required: true
    },
    //Accommodation name
    name: {
        type: String,
        unique: false,
        required: true
    },
    //Accommodation address
    address: {
        type: addressSchema,
        required: true
    },
    //Accommodation phone number
    phoneNumber: {
        type: String,
        required: true
    },
    //Average length of stay for the user, in weeks
    stayLength: {
        type: Number,
        required: true
    },
    //Accommodation age range for stay
    ageRange: {
        type: ageSchema,
        required: true
    },
    //Tags that describe the accomadation's beds, as an array
    tags: {
        type: [tagSchema],
        required: false
    },
    //Accommodation bed details, as an array
    beds: [bedSchema],
    //Timestamp for last updated
    updated: {
      type: Number,
      required: true
    },
    //Website links to the accommodation (if they have any)
    website: {
      type: String,
      required: false
    }
});

mongoose.model('Accommodation', accommodationSchema);
