import mongoose,{Schema} from "mongoose";

const UserSchema = new Schema({
    email : {
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    firstName : {
        type:String,
        required:true,
        trim:true
    },
    photo:{
        type:String,
        required:true,
        default:"https://www.pexels.com/photo/brown-and-white-owl-in-close-up-photography-6279330/"
    },
    clerkId:{
        type:String,
        required:true,
        unique:true
    }
})

const UserModel = mongoose.models.users || mongoose.model("users",UserSchema);

export default UserModel;