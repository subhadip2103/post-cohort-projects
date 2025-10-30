const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String
})

const Admin = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String,

})

const Course = new Schema({
    Title: String,
    Description: String,
    Duration: String,
    Image: String,
    Price: Number,
    creatorId: ObjectId,
})

const Purchase = new Schema({
    userID: ObjectId,
    courseId: ObjectId
})


const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("courses", Course)
const PurchaseModel = mongoose.model("purchases", Purchase)

module.exports = ({
    UserModel: UserModel,
    AdminModel: AdminModel,
    CourseModel: CourseModel,
    PurchaseModel: PurchaseModel
})