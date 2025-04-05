import { uploadOnCloudinary } from "../services/cloudinary.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const createPost = async (req, res) => {
  try {
    const { content, email } = req.body;

    // console.log(req.body);
    // console.log(req.files);

    if (!content || !email) {
      return res.status(400).json({
        success: false,
        message: "Content and userEmail are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase()},{password:0});

    // console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // const userID = user._id;
    const userId = new mongoose.Types.ObjectId(user._id);

    // console.log(userId);

    let postPhotoUrl = null;

    if (req.files?.post_photo) {
      const localFilePath = req.files.post_photo[0].path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      postPhotoUrl = uploadResult.secure_url;
    }

    // console.log(postPhotoUrl);

    const newPost = new Post({
      content,
      userId,
      photo: postPhotoUrl,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
      user:user
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(id);
    // console.log(req.query);
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log(req.query);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find all posts by the user
    const posts = await Post.find({ userId });

    // console.log(posts);

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found for this user",
        posts: [],
      });
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllPosts = async (req, res) => {
  const { page, limit } = req.query;
  const totalCount = await Post.countDocuments();
  // console.log(page, limit);
  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

      if(!posts){
        return res.status(200).json({
          success:true,
          message:"No posts Found!",
          posts:[],
          totalCount
        })
      }

      if(posts.length === 0){
        return res.status(200).json({
          success:true,
          message:"No more posts!",
          posts:[],
          totalCount
        })
      }

      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          const user = await User.findOne(
            { _id: post.userId },
            { full_name: 1, profile_pic: 1, user_type:1, _id: 0 }
          );

          // console.log(user);
      
          return { ...post?._doc, ...user?._doc }; 
        })
      );
      
      // console.log(postsWithUsers);

      return res.status(200).json({
        success:true,
        message:"Fetched successfully!",
        posts:postsWithUsers,
        totalCount
      })

      
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export { createPost, getUserPosts, deletePost, getAllPosts };
