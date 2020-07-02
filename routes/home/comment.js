var express=require('express');
var router=express.Router();
const mongoose=require('mongoose');
var Solutionpost=require('../../models/solutionposts');
var Post=require('../../models/posts');
var User=require('../../models/users');
var Discusspost=require('../../models/discussposts');
var Comment=require('../../models/comment');
var Discusscomment=require('../../models/discusscomment');
const{eq}=require('../../helpers/helpers'); 

router.post('/:id',(req,res)=>{
  
   if(req.user){
     Post.findOne({_id:req.params.id}).then(post=>{
      
              const comment=new Comment({
            user:req.user.id,
            postid:req.params.id,
            body:req.body.body,
            date:Date.now()
        })
        var m=post.allowcomment;
        
        post.comment.push(comment);
        post.save();
        comment.save();
        res.redirect('/post/'+req.params.id);
        
    
        
        
    })
}
else{
    var loginpost=req.params.id;
    req.flash('success_message','you need to log in for comment');
    res.redirect("/post/"+req.params.id);
}
    
})
router.post('/discuss/:id',(req,res)=>{
    
    
   if(req.user){
     Solutionpost.findOne({_id:req.params.id}).then(post=>{
    
       
        
              const comment=new Discusscomment({
            user:req.user.id,
            postid:req.params.id,
            body:req.body.body,
            date:Date.now()
        })
        var m=post.allowcomment;
        
        post.comment.push(comment);
        post.save();
        comment.save();
        res.redirect('/solutionview/'+req.params.id);
        var loginpost=req.params.id;
   
       
       
        
    })
}
    else{
        req.flash('success_message','you need to log in for comment');
        res.redirect("/post/"+req.params.id);
    }

    
})





module.exports=router;