const mongoose=require('mongoose');

const blogitemSchema= new mongoose.Schema({
    image:String,
    title:String,
    category:String,
    content:String,
    date:String
});
const Blog=module.exports=mongoose.model("Blog",blogitemSchema);