const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;

const userSchema = {
    email: { type: String, unique: true },
    password:String,
    firstname:String,
    lastname:String
}

const adminSchema = {
    email: { type: String, unique: true },
    password:String,
    firstname:String,
    lastname:String
}

const courseSchema={
    title:String,
    description:String,
    thumbnail:String,
    courseduration:Number,
    creatorid:ObjectId,
    price:Number
}

const purchaseSchema={
    userid:ObjectId,
    courseid:ObjectId
}

const userModel= mongoose.model("users",userSchema)
const adminModel= mongoose.model("admins",adminSchema)
const courseModel= mongoose.model("courses",courseSchema)
const purchaseModel= mongoose.model("purchases",purchaseSchema)

module.exports={
    userModel:userModel,
    adminModel:adminModel,
    courseModel:courseModel,
    purchaseModel:purchaseModel
}