import { Link } from "react-router-dom";
import { FiLinkedin, FiGithub, FiAward, FiBook } from "react-icons/fi";
import React from "react";

const ProfileCard = ({
  user,
  showAlert = () => {},
  showUpdateProfile = true,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group w-full max-w-2xl mx-auto">
      {/* Cover Photo Section */}
      <div className="relative h-36 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.cover_photo && (
          <img
            src={user.cover_photo}
            className="w-full h-full object-cover opacity-90"
            alt="Cover"
          />
        )}
        <div className="absolute -bottom-14 md:-bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={user.profile_pic}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110"
              alt="Profile"
            />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-16 md:pt-20 px-5 md:px-6 pb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {user.full_name}
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-1 truncate">
          {user.email}
        </p>
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
          {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
        </span>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full shadow-sm">
            <FiAward className="text-blue-600 text-sm md:text-base" />
            <span className="text-xs md:text-sm font-medium">
              {user.college_name}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full shadow-sm">
            <FiBook className="text-purple-600 text-sm md:text-base" />
            <span className="text-xs md:text-sm font-medium">
              {user.branch}
            </span>
          </div>
        </div>

        <p className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-full inline-block text-xs md:text-sm font-medium shadow-sm">
          🎓 Roll: {user.roll_number}
        </p>

        {/* Domains Section */}
        {user.domains && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Domains interested in
            </h3>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {user.domains.map((domain, index) => (
                <span
                  key={index}
                  className={`px-4 py-1 rounded-full text-xs md:text-sm font-medium shadow-md transition-transform transform hover:scale-105 ${
                    index % 3 === 0
                      ? "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900"
                      : index % 3 === 1
                      ? "bg-gradient-to-r from-purple-200 to-purple-400 text-purple-900"
                      : "bg-gradient-to-r from-pink-200 to-pink-400 text-pink-900"
                  }`}
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mt-6">
          {user.linkedin_link !== "Unchanged" && (
            <Link
              to={user.linkedin_link}
              className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-transform hover:scale-110 shadow-md"
              target="_blank"
            >
              <FiLinkedin className="text-blue-600 w-6 h-6" />
            </Link>
          )}
          {user.github_link !== "Unchanged" && (
            <Link
              to={user.github_link}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-transform hover:scale-110 shadow-md"
              target="_blank"
            >
              <FiGithub className="text-gray-800 w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
