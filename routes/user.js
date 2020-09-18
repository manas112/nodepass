const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');


//user modal
const User = require('../model/User');
const { route } = require('.');


//login page
router.get('/login', (req,res) => res.render('login'));

//register page
router.get('/register', (req,res) => res.render('register'));

//Register Handle

router.post('/register', (req,res) =>{
    const {name,email,password,password2 }= req.body;

    let errors =[];
    //check required feilds
    if(!name || !email || !password || !password2)
    {
        errors.push({msg: 'Please Fill in all Fields'});
    }
    //check password match
    if(password != password2){
        errors.push({msg: 'Passwords Do not Match'});
    }
    //check pass length

    if(password.length < 6){
        errors.push({msg: 'Password Should be at least 6 characters'});
    }

    if(errors.length> 0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });

    }
    else{
        //validation passed
        //it means eamil equal email
        User.findOne({email: email})
        .then(user =>{
            if(user){
                errors.push({msg: 'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });

            }
            else{

                const newUser = new User({
                    name,
                    email,
                    password
                });

               //Hash Password
               bcrypt.genSalt(10,(err, salt)=> bcrypt.hash(newUser.password,salt, (err,hash) =>{
                   if(err) throw err;

                   //set password to hashed
                   newUser.password= hash;
                   //save user
                   newUser.save()
                   .then(user => {
                       req.flash('success_msg', 'You are now registered and can log in');
                       res.redirect('/user/login');
                   })
                   .catch(err => console.log(err));

                   
               }))
            }
        });

    }

});


//Login Handle
router.post('/login',(req,res,next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req,res,next);

});

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('./user/login');
  });
module.exports = router;