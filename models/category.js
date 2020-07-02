const mongoose=require('mongoose');

const categoryitemSchema= new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
const Category=module.exports=mongoose.model("Category",categoryitemSchema);