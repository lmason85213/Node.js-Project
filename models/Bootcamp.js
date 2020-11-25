const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [50, 'Name can not be more than 50 charaters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a name'],
        maxLength: [500, 'Name can not be more than 500 charaters']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxLength: [20, 'Please number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a vaild email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        //GeoJSON Point 
        type: [{
            type: "String",
            required: true,
            enum: ['Point'],
            default: 'Point'
        }],
        required: true,
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

//Create Bootcamp Slug 
BootcampSchema.pre('save', function(next){
 this.slug = slugify(this.name, { lower: true })
 next();
});

//Geocode & create location field
BootcampSchema.pre('save', async function(next) {
    //console.log(geocoder.geocode(this.address));
   const loc = await geocoder.geocode(this.address);
    let result = this.location = {
       type: 'Point', 
       coordinates: [loc[0].longitude, loc[0].latitude], 
       formattedAddress: loc[0].formattedAddress, 
       street: loc[0].streetName, 
       city: loc[0].city, 
       state: loc[0].stateCode, 
       zipcode: loc[0].zipcode, 
       country: loc[0].countryCode
   }
   console.log(result);
   //Do not save address in DB 
   this.address= undefined; 
   
    next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);