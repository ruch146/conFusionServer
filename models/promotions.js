//creating promotions schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
//loading mongoose currency type in mongoose
require('mongoose-currency').loadType(mongoose);

//declaring some constant as currency type
//so as to make use of it while defining schema
const Currency=mongoose.Types.Currency;


//creating schema of promotions
const promotionSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{ 
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
    description: {
        type: String,
        required: true
    },
    featured:{
        type:Boolean,
        default:false
    }
})

var Promotions = mongoose.model('Promotion', promotionSchema);

//exporting this model
module.exports = Promotions;