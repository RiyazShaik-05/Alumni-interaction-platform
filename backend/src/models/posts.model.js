import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photo: {
    type: String, // Store image URL or file path
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt & updatedAt
});

const Post = mongoose.model('Post', postSchema);
export default Post;
