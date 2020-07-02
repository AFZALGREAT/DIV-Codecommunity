const express=require('express');
const app=express();
const path=require('path');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
var config=require('./config/database');
const bodyparser=require("body-parser");
const methodoverride=require('method-override');
const upload=require('express-fileupload');
const fs=require('fs');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
var helpers = require('handlebars-helpers')();
//const flash=require('express-flash');
//const flash= require('req-flash');
//require('../../models/comment');
//declare promise
// hbs.registerHelper('ifeq', function (a, b, options) {
//     if (a == b) { return options.fn(this); }
//     return options.inverse(this);
// });
mongoose.Promise=global.Promise;

//connect mongodb
mongoose.connect(config.database,{useNewUrlParser:true});


app.use(express.static(path.join(__dirname,'public')));

const{select,generatetime,substr,ifEqual}=require('./helpers/helpers');

app.engine('hbs',exphbs({defaultLayout:'home', extname: '.hbs',helpers:{select: select,generatetime:generatetime ,substr:substr,ifEqual:ifEqual,helpers}}))
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.urlencoded({extended:true}));


//upload midleware
app.use(upload());


//mongoose.set('useFindAndModify', true);
//method override
app.use(methodoverride('_method'));


//use session and flash
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  //define local variable for middleware
  app.use((req,res,next)=>{
      res.locals.user=req.user||null;
      res.locals.nm=null;
      //console.log(res.locals.user);
      res.locals.success_message=req.flash('success_message');
      res.locals.success_message1=req.flash('success_message1');
      console.log(res.locals.success_message1);
      res.locals.error=req.flash('error');
      console.log(res.locals.error);
     // res.locals.form_errors=req.flash('form_errors');
      next();
  })
  

//create route
const home=require('./routes/home/index.js');
const admin=require('./routes/admin/index.js');
const posts=require('./routes/admin/posts.js');
const category=require('./routes/admin/category.js');
const comment=require('./routes/home/comment.js');
const user=require('./routes/user/index.js');

//use route
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/category',category);
app.use('/home/comment',comment);




app.listen(4000,function(){
    console.log('started at 4000');
})