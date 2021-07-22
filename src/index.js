
//importing modules
    //for starting the server
const express = require('express');
const path = require('path');
    //for the login
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
//const flash = require('connect-flash');//for sending flash messages


//starting server
const app = express();

//Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname+ '/views'));
app.set('port', process.env.PORT || 3000);


//middlewares


app.use(express.urlencoded({extended:true})); //able to read a form, through post method?
app.use(cookieParser('mi ultra secreto')); //this shouldnt be known by anyone

    //configuring session
    app.use(session({
    secret: 'mi ultra secreto',
    resave: true, //look for more info
    saveUninitialized: true ////look for more info
    }));

    //configuring passport
    app.use(passport.initialize());
    app.use(passport.session()); 
    //it is neccesary to install the corresponded package (npm i passport-local)
    passport.use(new PassportLocal( (username, password, done)=>{ //these username/passwords are the names of the form

        //done(error, user (e.g. false value means couldnt login else is user))
        if(username == "diego.hdz.glez@gmail.com" && password=="123456"){
            return done(null, {id:1, name:"Diego"})
        }

        done(null,false); // infortm that with no errors user not found


    }));


    //serializacion
    passport.serializeUser((user,done)=>{
        done(null, user.id);
    });
    //deseralizacion
    passport.deserializeUser((id,done)=>{
        done(null, {id:1, name:'diego'})
    });

//app.use(flash());
    

//routes
app.get('/',(req,res,next)=>{
    if(req.isAuthenticated()) next(); //this req.isAuthenticated() is only allowed thx to passport
    else res.redirect('/login');
}, (req,res)=>{
    //mostrar el formulario de login
    console.log(req.user);
   res.send('logeao');
});

app.get('/login', (req,res)=>{
    //mostrar el formulario de login
   res.render('login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login",
    
    
}));

app.listen(app.get('port'), ()=>{
    console.log("server started on port " + app.get('port'));
    console.log(path.join(__dirname+ '/views'));
})
