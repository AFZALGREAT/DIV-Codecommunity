const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const discusscommentitemSchema= new mongoose.Schema({
   
    
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    postid:{
        type:String,
        required:true  
    },
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
    
});
const Discusscomment=module.exports=mongoose.model("Discusscomment",discusscommentitemSchema);