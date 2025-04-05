import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SmallSpinner, Logout, Loader, PostCard, ProfileCard } from "../index";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { includePosts, addPost } from "../../redux/slices/user.slice";
import { Send } from "lucide-react";

function Dashboard({ showAlert }) {
  const user = useSelector((state) => state.user.user);
  const posts = user.posts;

  // console.log(posts[1]);
  // console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [postsVisible, setPostsvisible] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!postContent.trim()) {
      showAlert("Post content cannot be empty!", "info");
      return;
    }

    if (!file) {
      showAlert("Select a Photo!", "info");
      return;
    }

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("content", postContent);
    formData.append("post_photo", file);

    try {
      // console.log(file);
      setLoading((prev) => !prev);
      const response = await axios.put("/api/posts/create-post", formData);
      // console.log(response);
      if (!response?.data?.success) {
        showAlert("Error Creating Post! Please try again later", "error");
        return;
      }
      // console.log(response);
      
      
      setFile(null);
      setPostContent("");
    } catch (error) {
      console.log(error.message);
    } finally {
      dispatch(addPost(response.data.post));
      showAlert("Post created successfully!", "success");
      setLoading((prev) => !prev);
      
    }
  };

  const handleShowPostsClick = async () => {
    try {
      // console.log(user.userId);
      const userId = user._id;
      const response = await axios.get("/api/posts/get-user-posts", {
        params: { userId },
      });
      if (!response?.data?.success) {
        showAlert("Error Fetching posts", "error");
        return;
      }
      dispatch(includePosts(response.data.posts));
    } catch (error) {
      console.log(error.message);
    } finally {
      setPostsvisible((prev) => !prev);
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Section */}
          <div className="mb-8 flex flex-col justify-center items-center gap-2">
            <ProfileCard user={user} showAlert={showAlert} />
            <div className="mt-2 w-inherit">
              <Link
                to={"/update-profile"}
                type="button"
                className={`w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md ${
                  loading ? "bg-gray-500" : "bg-blue-600"
                } text-white hover:bg-blue-700 focus:outline-none`}
              >
                {loading ? <SmallSpinner color="white" /> : "Update Profile"}
              </Link>
            </div>
          </div>

          {/* Post Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-semibold mb-4">
                  Create New Post
                </label>
                <textarea
                  id="postContent"
                  rows="4"
                  className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg leading-6 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Share your thoughts with the community..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 text-sm font-medium mb-4">
                  Attach Photo
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {file ? (
                        <span className="font-medium text-blue-600">
                          {file.name}
                        </span>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload</span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-3"
                >
                  {loading ? <SmallSpinner color="#fff"/> : <><p>Post</p><Send size={24} /></>}
                  
                </button>
                <span className="text-gray-500 text-sm">
                  {280 - postContent?.length} characters remaining
                </span>
              </div>
            </form>
          </div>

          {/* Posts Section */}
          <div className="flex-1 overflow-y-auto">
            <button
              onClick={handleShowPostsClick}
              className="w-full py-4 bg-gradient-to-r from-gray-100 to-blue-50 hover:from-gray-200 hover:to-blue-100 text-gray-700 font-semibold rounded-xl transition-all duration-300"
            >
              {postsVisible ? "Hide Posts" : "Show Posts"}
            </button>

            {postsVisible && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                {posts?.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
                    <p className="text-2xl text-gray-500 font-light">
                      No posts to display yet
                    </p>
                    <p className="text-gray-400 mt-2">
                      Create your first post above!
                    </p>
                  </div>
                ) : (
                  posts
                    .slice()
                    .reverse()
                    .map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        user={user}
                        showAlert={showAlert}
                      />
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
