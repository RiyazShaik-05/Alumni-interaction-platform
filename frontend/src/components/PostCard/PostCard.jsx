import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../redux/slices/user.slice";

const PostCard = ({
  post,
  user,
  showAlert = () => {},
  showDeleteDropdown = true,
  showBadge = false
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();

  // console.log(post);

  const toggleDelete = () => setShowDelete((prev) => !prev);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete("/api/posts/delete-post", {
        params: { id },
      });
      if (!response.data.success) {
        showAlert("Something went wrong!", "error");
        return;
      }
      dispatch(deletePost(id));
      showAlert("Post deleted successfully!", "success");
    } catch (error) {
      console.log(error.message);
    } finally {
      setShowDelete(false);
    }
  };


  return (
    <div className="bg-white group relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 w-full max-w-lg xl:grid-cols-4 mx-auto">
      {/* User Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.profile_pic}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg "
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {user.full_name}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Delete Dropdown */}
        {showDeleteDropdown && (
          <div className="relative">
            <button
              onClick={toggleDelete}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {showDelete && (
              <button
                onClick={() => handleDelete(post._id)}
                className="absolute right-0 top-10 bg-red-50 text-red-600 px-4 py-2 rounded-xl shadow-lg hover:bg-red-100 transition-colors duration-200 font-semibold text-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}

        {
          showBadge && <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">{user.user_type}</span>
        }


      </div>

      {/* Post Content */}
      <div className="mb-6">
        <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-xl p-4">
          {post?.content}
        </p>
      </div>

      {/* Post Image */}
      {post?.photo && (
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
          <img
            src={post?.photo}
            alt="Post"
            className="w-full h-[450px] object-cover  cursor-pointer"
          />
        </div>
      )}

      {/* Engagement Buttons */}
      <div className="flex items-center justify-between text-gray-500 px-2">
        <button className="flex items-center gap-2 hover:bg-pink-50 px-4 py-2 rounded-xl transition-colors duration-200">
          <svg
            className="w-6 h-6 text-pink-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="font-medium text-gray-700">42</span>
        </button>

        <button className="flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors duration-200">
          <svg
            className="w-6 h-6 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7v-2h10v2zm0-3H7V6h10v2z" />
          </svg>
          <span className="font-medium text-gray-700">3 Comments</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
