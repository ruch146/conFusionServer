//user schema and model that cracks userbane and password and also a flag to indicate the user is an administrator or normal user
var mongoose=require('mongoose');
var Schema=mongoose.Schema;


//user schema
var User=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    admin:{
        type:Boolean,
        dafault:false
    },

})

module.exports=mongoose.model('User',User);