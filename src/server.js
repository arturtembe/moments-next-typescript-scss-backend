//Loading module
const express=require('express');
const {engine}=require('express-handlebars');
const handlebars=require('handlebars');
const {allowInsecurePrototypeAccess}=require('@handlebars/allow-prototype-access')

const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');

const passport=require('passport');

const path=require('path');

//Variables
const app=express();
const post=require('./routers/post');
const user=require('./routers/user');
const like=require('./routers/like');
const image=require('./routers/image'); 
const comentario=require('./routers/commentario'); 

//Auth
require("../config/auth")(passport);

//Setttings

    //Express Session
    app.use(session({
        secret:'cursodenode',
        resave:true,
        saveUninitialized:true
    }));
    //Initialized Passport
    app.use(passport.initialize());
    app.use(passport.session());
    //Connect Fash
    app.use(flash())

    //Midleware
    app.use((req,res,next)=>{
        //Variaveis Globais
        res.locals.success_msg=req.flash("success_msg");
        res.locals.error_msg=req.flash("error_msg");

        res.locals.error=req.flash("error");
        res.locals.user=req.user || null;

        next();
    });

    //Body Parser
    app.use(cors());
    app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}));
    app.use(bodyParser.json({limit:'50mb'}));

    //Handlebars
    app.engine('handlebars',engine({defaultLayout:'main'}))
    app.engine('handlebars',engine({handlebars:allowInsecurePrototypeAccess(handlebars)}));
    app.set('view engine','handlebars');

    //Mongoose
    mongoose.connect('mongodb://localhost:27017/my_moments_app').then(()=>{
        console.log('Connected to mongodb');
    }).catch((error)=>{
        console.log('ERROR: '+error);
    });

    //Public - static archieve
    app.use(express.static(path.join(process.cwd(),"public")));
    //app.use(express.static("public"));

    //app.use(express.static(__dirname+"/public/css"));
    //app.use(express.static(__dirname+"/public/js"));

    //app.use(express.static(path.join(__dirname,"/upload")))

    //console.log(path.join(__dirname,"/upload"));

//Routers

    //Admin
    app.use('/postagens',post);

    //User
    app.use('/user',user);

    //User
    app.use('/like',like);

    //image
    app.use('/image',image);

    //Commentario
    app.use('/comentario',comentario);

//Others
const PORT=8081;
app.listen(PORT,()=>{
    console.log("The server is running");
})