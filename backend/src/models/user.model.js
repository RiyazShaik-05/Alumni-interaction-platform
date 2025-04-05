import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    college_name: {
      type: String,
    },
    branch: {
      type: String,
      maxlength: 100,
    },
    roll_number: {
      type: String,
      default:"",
      unique: true,
      maxlength: 50,
    },
    github_link: {
      type: String,
      default: "",
    },
    linkedin_link: {
      type: String,
      default: "",
    },
    cover_photo: {
      type: String,
      default: "",
    },
    domains: {
      type: [String],
      default: [],
    },
    user_type: {
      type: String,
      enum: ["student", "alumni", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
