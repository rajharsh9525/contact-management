const express = require('express');
const Router = express.Router();
const Contact=require('../models/contact.model');
const authMiddleware=require("../middlewares/auth");
const jwt=require('jsonwebtoken');
const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

Router.post('/add-contact',authMiddleware,async(req, res) => {
    try{
        const user=jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
        await jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
        // console.log(user);
        const {image} = req.files.image;
        const uploadedImage=await cloudinary.uploader.upload(image.tempFilePath);
        const { fullName,email,phone,gender }=req.body;
        const newContact=new Contact({
            fullName,
            email,
            phone,
            gender,
            userId:req.user.userId,
            imageUrl:uploadedImage.secure_url,
            imageId:uploadedImage.public_id,
        });
        await newContact.save();
            res.status(201).json({
            message:'contact added successfully',
            data:newContact,
        });
    }
    catch(error){
        res.status(500).json({
            message:'Failed to add contact',
            error:error.message,
        });
    }
});

Router.get('/view-contacts', authMiddleware, async(req, res) => {
    try{
        const contacts=await Contact.find({userId:req.user.userId});
        res.status(200).json({
            message:'contacts retrieved successfully',
            data:contacts,
        });
    }
    catch(error){
        res.status(500).json({
            message:'Failed to view contacts',
            error:error.message,
        });
    }
});

Router.get('/view-contact/:id', authMiddleware, async(req, res) => {
    try{
        const contact=await Contact.findOne({
            _id:req.params.id,
            userId:req.user.userId,
        });
        if(!contact){
            return res.status(404).json({
                message:'Contact not found',
            });
        }
        res.status(200).json({
            message:'Contact retrieved successfully',
            data:contact,
        });
    }
    catch(error){
        res.status(500).json({
            message:'Failed to view contact',
            error:error.message,
        });
    }
});

Router.get("/view-contacts/:gender",authMiddleware, async(req,res)=>{
    try{
        const gender=req.params.gender;
        const contacts=await Contact.find({
            gender:gender,
            userId:req.user.userId,
        });
        if(contacts.length===0){
            return res.status(404).json({
                message:`There is not any ${gender} contacts saved by you`,
            });
        }
        res.status(200).json({
            message:'contacts retrieved successfully',
            data:contacts,
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message,
        });
    }
});

Router.delete("/delete-contact/:id" , authMiddleware,async(req,res)=>{
    try{
        const {id}=req.params;
        const data=await Contact.findById(id);
        if(!data){
            return res.status(404).json({
                message:'Contact not found',
            });
        }
        await cloudinary.uploader.destroy(data.imageId);
        const deletedContact=await Contact.findByIdAndDeleteOne({
            _id:id,
            userId:req.user.userId
        });
        if(!deletedContact){
            return res.status(404).json({
                message:'Contact not found',
            });
        }
        res.status(200).json({
            message:'Contact deleted successfully',
            data:deletedContact,
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message,
        });
    }
});

Router.delete("/delete-contacts/:gender", authMiddleware, async(req,res)=>{
    try{
        const {gender}=req.params;
        const deletedContacts=await Contact.deleteMany({
            gender:gender,
            userId:req.user.userId,
        });
        if(deletedContacts.deletedCount===0){
            return res.status(404).json({
                message:`There is not any ${gender} contacts saved by you`,
            });
        }
        res.status(200).json({
            message:'Contacts deleted successfully',
            data:deletedContacts,
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message,
        });
    }
});

Router.put("/update-contact/:id", authMiddleware, async(req,res)=>{
    try{
        const {id}=req.params;
        const {fullName,email,phone,gender}=req.body;
        const updatedContact=await Contact.findOneAndUpdate(id,{
            fullName,
            email,
            gender,
            phone,
            userId:req.user.userId,
        });
        if(req.files){
            const {image}=req.files.image;
            await cloudinary.uploader.destroy(updatedContact.imageId);
            const uploadedImage=await cloudinary.uploader.upload(image.tempFilePath);
            updatedContact.imageUrl=uploadedImage.secure_url;
            updatedContact.imageId=uploadedImage.public_id;
        }
        await updatedContact.save();
        if(!updatedContact){
            return res.status(404).json({
                message:'Contact not found',
            });
        }
        res.status(200).json({
            message:'Contact updated successfully',
            data:updatedContact,
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message,
        });
    }
});

module.exports = Router;