var mongoose=require('mongoose');

//user schema
var userSchema=mongoose.Schema({
    profilepic:{
       type:String,
       required:true
    },
    email:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
        
    },
    college:{
        type:String
    },
    profession:{
        type:String
    },
    socialnetwork:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    hobby:{
        type:String
    },
    phone:{
        type:String
    },
    link:{
        type:String
    }

    
});

var User=module.exports=mongoose.model("User",userSchema);
