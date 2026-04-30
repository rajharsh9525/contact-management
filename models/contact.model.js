const mongoose=require('mongoose');
const contactSchema=new mongoose.Schema({
    fullName:{
        type:'string',
        minlength:[6,'name should be atleast 6 letters long'],
        required:true,
    },
    email:{
        type:'string',
        required:true,
        unique:true,
    },
    phone:{
        type:'number',
        required:true,
        unique:true,
    },
    gender:{
        type:'string',
        required:true,
    },
    userId:{
        type:'string',
        required:true,
    },
    imageUrl:{
        type:'string',
    },
    imageId:{
        type:'string',
    }

});
module.exports=mongoose.model('Contact',contactSchema);