const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//user modal
const User = require('../model/User');


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

                console.log(newUser)
                res.send('Hello');
            }
        });

    }

});
module.exports = router;