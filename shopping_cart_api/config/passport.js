var passport = require('passport');
var User =require('../models/user');
var LocalStrategy= require('passport-local').Strategy;

// console.log(User)
passport.serializeUser(function(user,done){
    done(null,user.id);
   
   
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});

passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',

    passReqToCallback:true
},function(req,email,password,done){
    console.log("Heelelelel")
    req.checkBody('password','Password length must be 3 or more').notEmpty().isLength({min:3});
    var errors=req.validationErrors();
    console.log(errors)
    if(errors){
        var message=[]
        errors.forEach(function(error){
            message.push(error.msg);
        });
        return done(null,false,req.flash("error",message));
    }
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }   
        if(user){
            return done(null,false,req.flash("error","Email is register"))
        }
       
        var newUser=new User();
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.save(function(err,result){
            if(err){
                return done(err)
            }
            if(result){
                return done(null,newUser);
            }
        })
    })
}))

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({'email':email},function(err,user){
        if(err){
           
            return done(err);
        }   
        if(!user){
            return done(null,false,req.flash("error","Email is not register"))
        }
        if(!user.validPassword(password)){
            return done(null,false,req.flash("error","Password Not Match"))
        }
        return done(null,user);
    })

}))