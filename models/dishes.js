//creating dishes and schema for dishes

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//loading mongoose currency type in mongoose
require('mongoose-currency').loadType(mongoose);

//declaring some constant as currency type
//so as to make use of it while defining schema
const Currency=mongoose.Types.Currency;


//comment schema
var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//creating schema of dishes
const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image:{ 
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0

    },
    featured:{
        type:Boolean,
        default:false
    },
    comments:[commentSchema]
},{
    timestamps: true
});

//writing Dish because mongoose will automatically convert it into plurals
//and name the collection as dishes automatically
//creating model from this schema
var Dishes = mongoose.model('Dish', dishSchema);

//exporting this model
module.exports = Dishes;