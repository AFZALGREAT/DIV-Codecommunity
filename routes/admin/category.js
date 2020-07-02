var express=require('express');
var router=express.Router();
var Category=require('../../models/category');

router.all('/*',function(req,res,next){
    req.app.locals.layout='admin';
    next();
})

router.get('/',(req,res)=>{
    Category.find({},function(err,category){
        res.render('admin/category/category',{category:category});
    })
    
})
router.post('/create',(req,res)=>{

      category=new Category({
          name:req.body.name
          
      })
      category.save();
    res.redirect("/admin/category");
})





module.exports=router;