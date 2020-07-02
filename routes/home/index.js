var express=require('express');
var router=express.Router();
var Post=require('../../models/posts');
var Discusscomment=require('../../models/discusscomment');
var Discusspost=require('../../models/discussposts');
var Solutionpost=require('../../models/solutionposts');
var User=require('../../models/users');
var Comment=require('../../models/comment');
var bcrypt=require('bcryptjs');
const passport=require('passport');
var fs=require('fs');




const{ isEmpty,uploadDir}=require('../../helpers/filehelper'); 
const LocalStrategy=require('passport-local').Strategy;

router.all('/*',function(req,res,next){
    req.app.locals.layout='home';
    next();
})
//global use
var t=0;

  

router.get('/create/solution/:id',(req,res)=>{
    res.render('home/createpost',{posts:req.params.id,t:1});  
})     
        

   
    


router.post('/create/solution/:id',(req,res)=>{
   
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
      const post=new Solutionpost({
          user:req.user,
          title:req.body.title,
          status:req.body.status,
          allowcomment:allowcomments,
          body:req.body.body,
          querypostid:req.params.id,
          ytlink:req.body.ytlink,
          file:media
      })
      post.save()
      .then(savePost=>{
       var t=req.flash('success_message1','Solution  is successfully submited click view ')
         console.log(t);
       res.redirect('/discuss');  
  
      })
     
  })







router.get('/discuss',(req,res)=>{
    if(req.user){
        Discusspost.find({}).populate({path:'user',model:User}).sort({date:'desc'}).then(posts=>{
         
            // if(err)
            // throw err;
           
            res.render('home/discuss',{posts:posts,t:1});  

        })
    }
    
    else{
        req.flash('success_message','You need to login to view');
        res.redirect('/login');
    }

    
    })


router.get('/ask',(req,res)=>{
        res.render('home/askpost',{t:1});  
    })
    


router.post("/ask",(req,res)=>{
      
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
                
             })
             }
          
          
         }
         
        
         
          const post=new Discusspost({
              user:req.user,
              title:req.body.title,
              tag:req.body.status,
             
              body:req.body.body,
              
              file:media
          })
          post.save()
          .then(savePost=>{
           var t=req.flash('success_message1','post is successfully created')
             console.log(t);
           res.redirect('/discuss');  
      
          })
         
      })
    

router.get('/solution/:id',(req,res)=>{

        Solutionpost.find({querypostid:req.params.id}).populate({path:'user',model:User}).sort({date:'desc'}).then(posts=>{
         
            //  if(err)
            // throw err;
           var p=posts.length;
           if(p>0)
            res.render('home/solutionindex',{posts:posts,t:1});
            else
            {
                req.flash('success_message1','No Solution yet ') ;
                res.redirect('/discuss/'+req.params.id);
            }

        })
       
    })

    
router.get('/solutionview/:id',(req,res)=>{
        Solutionpost.findById({_id:req.params.id}).populate({ path: 'comment', model:Discusscomment ,options:{ sort:{_id : 'desc'}},
        populate: {
          path: 'user',
          model: User
        } }).populate({path:'user',model:User}).then(function(posts){
            
           
            res.render('home/solutionview',{posts:posts,t:1});
        })
    })



router.get('/',(req,res)=>{
        Post.find({}).populate({path:'user',model:User}).sort({date:'desc'}).then(posts=>{
         
            //  if(err)
            //  throw err;
           
            res.render('home/index',{posts:posts,t:t});

        })
       
    })


router.get('/category/:id',(req,res)=>{
        Post.find({status:req.params.id}).sort({date:'desc'}).populate({path:'user',model:User}).then(posts=>{
         
            //  if(err)
            //  throw err;
            var p=posts.length;
           if(p>0)
            res.render('home/index',{posts:posts,t:req.params.id,t:0});
            else
            {
                req.flash('success_message1','No Posts Related this  ') ;
                res.redirect('/');
            }
        })
       
    })
    

router.get('/createpost',(req,res)=>{
        req.flash('success_message','You need to login to start');
        res.redirect('/login');
    })


router.get('/about',(req,res)=>{
        res.render('home/about',{t:t});
    })


router.get('/login',(req,res)=>{
        
        res.render('home/login',{t:t});
    })

//post login 

passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
    console.log(email);
    User.findOne({email:email},function(err,user){
      console.log(user);
        if(!user) 
        return done(null,false,{message:'No user found'});

        bcrypt.compare(password,user.password,(err,match)=>{
            if(err){
            return err;}
            if(match){
                return done(null,user,{user:user.firsname},{message:'welcome '+user.firsname});
            }
            else{
                return done(null,false,{message:'incorrect password'});
            }
        })
       



    })

}))


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });




router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
});



router.get('/register',(req,res)=>{
        res.render('home/register',{t:t});
    })



router.get('/post/:id',(req,res)=>{
        Post.findById({_id:req.params.id}).populate({ path: 'comment', model: Comment ,options:{ sort:{_id : 'desc'}},
        populate: {
          path: 'user',
          model: User
        } }).populate({path:'user',model:User}).then(function(posts){
            
           
            res.render('home/post',{posts:posts,t:t});
        })
    })



router.get('/discuss/:id',(req,res)=>{
  
        Discusspost.findById({_id:req.params.id}).populate({path:'user',model:User}).then(function(posts){

            
            res.render('home/viewdiscuss',{posts:posts,t:1});
        })
    })


router.post('/register',(req,res)=>{
      
        
        let filename='';
   if(!isEmpty(req.files)){
    let file=req.files.file;
    
     filename=Date.now()+"-"+file.name;
  
  file.mv('./public/uploads/'+filename,(err)=>{
        // if(err)
        // throw err;
      
        console.log(filename);
    })
    
   }

       const user=new User({
           profilepic:filename,
           firstname:req.body.firstname,
           lastname:req.body.lastname,
           email:req.body.email,
           password:req.body.password,
           
       })
       bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(user.password,salt,(err,hash)=>{
               //console.log(hash);
            user.password=hash;
               user.save();
        req.flash('success_message1','you are registered successfully ,plz login to continue');
        res.redirect('/login');
           })
       })
       
    })
    router.get('/logout',(req,res)=>{
        
        req.logout();
        res.redirect('/');
    })
    router.post('/delete/comment/:id',(req,res)=>{
       //Comment.findByIdAndRemove({_id:req.params.id}).populate({path:'comment',model:Post}).exec(function (err){
          
      // })
     
      var t=req.params.id;
      console.log(req.params.id);
      var buttonid=req.body.afzal;
      console.log(buttonid);
    //   if(req.user){
    //   Comment.find({_id:t}).populate({path:'user',model:User}).then(cmt=>{
    //       console.log(cmt);
        // if(cmt.user===req.user.id){
        //     Comment.findByIdAndRemove({_id:t}).populate({path:'comment',model:Post}).exec(function (err){
        //               //console.log(kit);
        //              if(err)
        //              throw err;
        //               //console.log('hi');
        //               req.flash('success_message1','comment deleted successfully');
        //               res.redirect("/post/"+buttonid);
                     
        //           })
        // }
        // else{
        // req.flash('success_message','you are not authorised to delete');
        //  res.redirect("/post/"+buttonid);
        // }
        
        
    //   })

    // }
    // else{
    //     req.flash('success_message','you need to login');
    //       res.redirect("/post/"+buttonid);
    // }
      if(req.user){
      Comment.findByIdAndRemove({_id:t}).populate({path:'comment',model:Post}).exec(function (err){
          //console.log(kit);
        //  if(err)
        //  throw err;
          //console.log('hi');
          req.flash('success_message1','comment deleted successfully');
          res.redirect("/post/"+buttonid);
         
      })}
      else{
          req.flash('success_message','you need to login');
          res.redirect("/post/"+buttonid);
      }
      
    })


router.post('/delete/comments/:id',(req,res)=>{
        //Comment.findByIdAndRemove({_id:req.params.id}).populate({path:'comment',model:Post}).exec(function (err){
           
       // })
      
       var t=req.params.id;
       console.log(req.params.id);
       var buttonid=req.body.afzal;
       console.log(buttonid);
     //   if(req.user){
     //   Comment.find({_id:t}).populate({path:'user',model:User}).then(cmt=>{
     //       console.log(cmt);
         // if(cmt.user===req.user.id){
         //     Comment.findByIdAndRemove({_id:t}).populate({path:'comment',model:Post}).exec(function (err){
         //               //console.log(kit);
         //              if(err)
         //              throw err;
         //               //console.log('hi');
         //               req.flash('success_message1','comment deleted successfully');
         //               res.redirect("/post/"+buttonid);
                      
         //           })
         // }
         // else{
         // req.flash('success_message','you are not authorised to delete');
         //  res.redirect("/post/"+buttonid);
         // }
         
         
     //   })
 
     // }
     // else{
     //     req.flash('success_message','you need to login');
     //       res.redirect("/post/"+buttonid);
     // }
      
       Comment.findByIdAndRemove({_id:t}).populate({path:'comment',model:Post}).exec(function (err){
           //console.log(kit);
        //   if(err)
        //   throw err;
           //console.log('hi');
           req.flash('success_message1','comment deleted successfully');
           res.redirect("/admin/viewcomments/"+buttonid);
          
       })
       
       
     })

module.exports=router;