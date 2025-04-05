import express from "express";
import { createPost, deletePost, getAllPosts, getUserPosts } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multerMiddleware/multer.middleware.js";

const router = express.Router();

router.put(
    "/create-post",
    upload.fields([
      { name: "post_photo", maxCount: 1 }
    ]),
    createPost
  );

router.get("/get-user-posts",getUserPosts)
router.delete("/delete-post",deletePost)
router.get("/get-all-posts",getAllPosts)
export default router;