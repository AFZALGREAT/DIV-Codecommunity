const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const postitemSchema= new mongoose.Schema({
   
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    solution:{
        type:Schema.Types.ObjectId,
        ref:'solutions' 
    },
    querypostid:{
        type:String,
        default:0
    },
    title:{
        type:String,
        required:true
    },
    file:[{
        type:String,
        
    }],
    ytlink:{
       type:String,
       default:0
    },
    status:{
        type:String,
        
    },
    body:{
        type:String,
        require:true
    },
    ratingscore:{
        type:String,
    },
    allowcomment:{
        type:Boolean,
        require:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    time:{
        type:Date,
        default:Date.now()
    },
    comment:[{
        type:Schema.Types.ObjectId,
        ref:'comment'
    }]
});
const Post=module.exports=mongoose.model("Post",postitemSchema);