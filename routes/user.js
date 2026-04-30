const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async(req, res) => {
    try{
        const user=await User.find({email:req.body.email});
        if(user.length>0){
            return res.status(400).json({
                message:'User already exists',
            });
        }
        const hashPassword=await bcrypt.hash(req.body.password,10);
        const newUser=new User({
            fullName:req.body.fullName,
            email:req.body.email,
            password:hashPassword,
            phone:req.body.phone,
            address:req.body.address,
        });
        await newUser.save();
        res.status(201).json({
            message:'User created successfully',
            data:newUser,
        });
    } catch (error) {
        res.status(500).json({
            message:'Error creating user',
            error:error.message
        });
    }
});

router.post('/login', async(req, res) => {
    try{
        const email=req.body.email;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                message:'User not found',
            });
        }
        const isPasswordValid=await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message:'Invalid password',
            });
        }
        const token=jwt.sign({userId:user._id,
            email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({
            message:'Login successful',
            data:user,
            token:token
        });
    } catch (error) {
        res.status(500).json({
            message:'Error logging in',
            error:error.message
        });
    }
});

module.exports = router;