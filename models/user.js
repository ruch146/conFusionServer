//user schema and model that cracks userbane and password and also a flag to indicate the user is an administrator or normal user
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//mongoose plugin
var passportLocalMongoose = require('passport-local-mongoose');


//username and  hashed passport support will be automatically added by mongoose plugin
var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',User);