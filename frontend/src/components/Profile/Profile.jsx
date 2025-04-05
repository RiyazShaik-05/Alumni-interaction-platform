import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, PostCard, ProfileCard } from "../index";

const Profile = ({ showAlert = () => {} }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading((prev) => !prev);
        const response = await axios.get(`/api/auth/get-user/?id=${id}`);
        const postsResponse = await axios.get(
          `/api/posts/get-user-posts/?userId=${id}`
        );
        console.log(response);
        console.log(postsResponse);
        if (!response.data.success) {
          showAlert("Something went wrong!", "error");
        } else {
          setUser(response.data.user);
        }

        if (!postsResponse.data.success) {
          showAlert("Something went wrong!", "error");
        } else {
          setPosts(postsResponse.data.posts);
        }
      } catch (error) {
        console.log(error);
        showAlert("Something went wrong!", "error");
      } finally {
        setLoading((prev) => !prev);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Loader />;
  if (!user)
    return <p className="text-center text-gray-500">User not found.</p>;

  return (
    // <div className="bg-gray-50 min-h-screen">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    //     {/* Profile Info */}
    //     <div className="mb-8 flex flex-col justify-center items-center gap-4">
    //       <img
    //         src={user.profile_pic || "/default-avatar.png"}
    //         alt={user.full_name}
    //         className="w-24 h-24 rounded-full object-cover shadow-md"
    //       />
    //       <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
    //     </div>

    //     {/* User Posts */}
    //     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
    //       {posts.length === 0 ? (
    //         <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
    //           <p className="text-2xl text-gray-500 font-light">No posts to display yet</p>
    //         </div>
    //       ) : (
    //         posts.map((post) => <PostCard key={post._id} post={post} user={user}/>)
    //       )}
    //     </div>
    //   </div>
    // </div>
    <>
      {loading && <Loader />}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Section */}
          <div className="mb-8 flex flex-col justify-center items-center gap-2">
            <ProfileCard user={user} showAlert={showAlert} show/>
            
          </div>
          {/* User Posts */}
          <p className="text-3xl text-gray-900 text-center font-light">
                  Posts
                </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-2xl text-gray-500 font-light">
                  No posts to display yet
                </p>
              </div>
            ) : (
              
              posts.map((post) => (
                <PostCard key={post._id} post={post} user={user} showDeleteDropdown={false}/>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import {Loader,PostCard} from "../index"

// const PublicProfile = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const { userData } = await axios.get(`/api/auth/get-user/${id}`);
//         const { postsData } = await axios.get(`api/posts/get-all-posts/${id}`)
//         setUser(userData.user);
//         setPosts(postsData.posts || []);
//       } catch (error) {
//         console.error("Error: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserProfile();
//   }, [id]);

//   if (loading) return <Loader />;
//   if (!user) return <p className="text-center text-gray-500">User not found.</p>;

// };

// export default PublicProfile;
