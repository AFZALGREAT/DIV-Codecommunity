var express=require('express');
var router=express.Router();
var Post=require('../../models/posts');
var User=require('../../models/users');
var Comment=require('../../models/comment');
//var Blog=require('../../models/blog');
const{userAuthentication}=require('../../helpers/aurthenticate');
router.all('/*',function(req,res,next){
    req.app.locals.layout='admin';
    next();
})
router.get("/",function(req,res){
    req.session.afzal='afzal';
    if(req.session.afzal){
        console.log('working');
        res.render('admin/index');
    }
    
})
router.get("/dashboard",function(req,res){
    Post.find({user:req.user.id

    }).then(function (count1){
     
     var obj = count1.length;
    // var obj1=count1.comment.size();
     console.log(count1);
     console.log(obj) ; 
        res.render('admin/dashboard',{count1:obj});
    });
   
})
router.get("/comments",function(req,res){
    var t="comments"
    var link="/admin/comments";
    Post.find({user:req.user},function(err,posts){
        res.render('admin/comments',{posts:posts,t:t,link:link});
    })
    
})
router.get("/viewcomments/:id",function(req,res){
    var t="comments";
    var u="viewcomments";
    var link="/admin/comments";
    var link1="/admin/viewcomments/req.params.id";
    Post.findById({_id:req.params.id}).populate({ path: 'comment', model: Comment ,options:{ sort:{_id : 'desc'}},
    populate: {
      path: 'user',
      model: User
    } }).populate({path:'user',model:User}).then(function(posts){
        
        //posts.comment=comment;
        console.log(posts)
        res.render('admin/viewcomments',{posts:posts,t:t,link:link,u:u,link1:link1});
    })
    
})

module.exports=router;
