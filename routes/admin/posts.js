var express=require('express');
var router=express.Router();
var fs=require('fs');
var User=require('../../models/users');
var Post=require('../../models/posts');
const{ isEmpty,uploadDir}=require('../../helpers/filehelper'); 
const{userAuthentication}=require('../../helpers/aurthenticate');
router.all('/*',function(req,res,next){
    req.app.locals.layout='admin';
    next();
})
router.get("/",function(req,res){
    res.render('create');
})
router.get("/create",function(req,res){
     var t="create post";
     var link="/admin/posts/create";
    res.render('admin/posts/create',{t:t,link:link});
})
router.get("/myinfo",function(req,res){
     var t="myinfo"
     var link="";
    res.render('admin/posts/myinfo',{t:t,link:link});
})
router.get("/allpost",function(req,res){
    var t="allpost";
    var link="/admin/posts/allpost";
    Post.find({user:req.user},function(err,posts){
        res.render('admin/posts/allpost',{posts:posts,t:t,link:link});
    })
   
})
router.post("/create",(req,res)=>{
  // console.log(req.body);
    let filename='';
    var media = [];
   if(!isEmpty(req.files)){
       var m=req.files.file;
    console.log(req.files);
       for(var i=0;i<m.length;i++){
        let file=m[i];
        
        
        filename=Date.now()+"-"+file.name;
     media.push(filename);
     file.mv('./public/uploads/'+filename,(err)=>{
           if(err)
           throw err;
          // else
           console.log(filename);
       })
       }
    
    
   }
   
  
    var allowcomments=true;
    if(req.body.allowcomment){
        allowcomments=true;
    }
    else{
        allowcomments=false;
    }
    const post=new Post({
        user:req.user,
        title:req.body.title,
        status:req.body.status,
        allowcomment:allowcomments,
        body:req.body.body,
        ytlink:req.body.ytlink,
        file:media
    })
    post.save()
    .then(savePost=>{
     var t=req.flash('success_message1','post is successfully created')
       console.log(t);
     res.redirect('/admin/posts/allpost');  

    })
    /*var t=req.flash('success_message','post is successfully created');
    console.log(t+"hello");
    res.redirect('/admin/posts/allpost');*/
})
router.get("/edit/:id",function(req,res){
    // console.log(req.params.id);
    //res.send(req.params.id);
     Post.findOne({_id:req.params.id},function(err,posts){
        // console.log(posts);
        res.render('admin/posts/edit',{posts:posts});
    })
    
})

router.post("/rate",(req,res)=>{
   var point=req.body.ratingpoint;
   
})


router.put("/edit/:id",(req,res)=>{
    var allowcomments=true;
    console.log('hello')
    //doubt why it is not working 


    /*Post.findOne({_id:req.params.id},function(err,posts){
        console.log(req.body);
    if(req.body.allowcomment){
        allowcomments=true;
    }
    else{
        allowcomments=false;
    }
    posts.title=req.body.title;
    posts.status=req.body.status;
    posts.allowcomment=allowcomments;
    posts.body=req.body.body;
    })
    posts.save();
    res.redirect("/admin/posts/allpost");*/
    Post.findOne({_id:req.params.id}).then(posts=>{
        if(req.body.allowcomment){
            allowcomments=true;
        }
        else{
            allowcomments=false;
        }
        posts.title=req.body.title;
        posts.status=req.body.status;
        posts.allowcomment=allowcomments;
        posts.body=req.body.body;
        
        if(!isEmpty(req.files)){
            let file=req.files.file;
             filename=Date.now()+"-"+file.name;
             posts.file=filename;
          //console.log(req.files);
          file.mv('./public/uploads/'+filename,(err)=>{
                if(err)
                throw err;
               // else
                //console.log(filename);
            })
            
           }
        posts.save().then(updatePost=>{
            
            var t=req.flash('success_message1','post is successfully updated');
            // console.log(t);

            res.redirect("/admin/posts/allpost");
        });
    });

    
    

    //ask why it is not working


   /* console.log(req.body.title);
   Post.findOneAndUpdate({"_id":req.param.id},{"$set":{
    "title":req.body.title,
    "status":req.body.status,
    "allowcomment":allowcomments,
    "body":req.body.body
   }}).exec(function(err, post){
    if(err) {
        console.log(err);
        
    } else {
            console.log("updated");
    }
 })*/
   //posts.save();

   //res.redirect("/admin/posts/allpost");
})
router.post('/delete/:id',function(req,res){
    var itemid=req.params.id;
   /* Post.findOne({_id:req.params.id},(err,posts)=>{
        console.log(posts);
        if(err)
        throw err;
        fs.unlink(uploadDir+posts.file,(err)=>{
            if(err)
            throw err;
        })
    })*/
    Post.findByIdAndRemove(itemid,function(err){
        if(!err){
            var t=req.flash('success_message','post is successfully deleted');
             console.log(t);
            res.redirect("/admin/posts/allpost");
        }
        else{
            console.log(err);
        }
    })

})
router.get("/editprofile/:id",function(req,res){
     var t="myinfo";
     var link="/admin/posts/myinfo";
    var u="editprofile";
      
     User.findOne({_id:req.params.id},function(err,posts){
        // console.log(posts);
        res.render('admin/editprofile',{posts:posts,u:u,t:t,link:link});
    })
})
router.get("/myinfo",function(req,res){
    res.render("admin/myinfo");
})

router.put("/editprofile/:id",(req,res)=>{
    
    
    User.findOne({_id:req.params.id}).then(posts=>{
        
        posts.firstname=req.body.firstname;
        posts.lastname=req.body.lastname;
        posts.city=req.body.city;
        posts.country=req.body.country;
        posts.college=req.body.college;
        posts.profession=req.body.profession;
        posts.phone=req.body.phone;
        posts.socialnetwork=req.body.socialnetwork;
        posts.link=req.body.link;
        posts.date=req.body.date;
        
        if(!isEmpty(req.files)){
            let file=req.files.file;
             filename=Date.now()+"-"+file.name;
             posts.file=filename;
          console.log(req.files);
          file.mv('./public/uploads/'+filename,(err)=>{
                if(err)
                throw err;
               else
                console.log(filename);
            })
            
           }
        posts.save().then(updatePost=>{
            
            var t=req.flash('success_message1','account is successfully updated');
            console.log(t);

            res.redirect("/admin/posts/myinfo");
        })
    })
})

module.exports=router;