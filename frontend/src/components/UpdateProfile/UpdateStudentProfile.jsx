import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { update } from "../../redux/slices/user.slice";
import {SmallSpinner} from "../index"

export default function UpdateStudentProfile({ showAlert = () => {} }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Form state management
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [collegeName, setCollegeName] = useState(user?.college_name || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [rollNumber, setRollNumber] = useState(user?.roll_number || "");
  const [githubLink, setGithubLink] = useState(user?.github_link || "");
  const [linkedinLink, setLinkedinLink] = useState(user?.linkedin_link || "");
  const [selectedDomains, setSelectedDomains] = useState(user?.domains || []);
  const [loading,setLoading] = useState(false);

  // File handling state
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(
    user?.profile_pic || null
  );
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(
    user?.cover_photo || null
  );

  // Available domains list
  const domains = [
    "Web Development",
    "AIML",
    "Cybersecurity",
    "Blockchain",
    "Data Science",
    "Cloud Computing",
    "IoT",
    "DevOps",
    "Game Development",
    "Software Engineering",
    "Mobile App Development",
  ];

  console.log(selectedDomains);

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setSelectedDomains((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => !prev);
      const formData = new FormData();

      // Append text fields
      formData.append("full_name", fullName);
      formData.append("college_name", collegeName);
      formData.append("branch", branch);
      formData.append("roll_number", rollNumber);
      formData.append("github_link", githubLink);
      formData.append("linkedin_link", linkedinLink);
      selectedDomains.forEach((domain) => {
        formData.append("domains", domain);
      });
      formData.append("email",user.email);

      // Append files if selected
      if (profilePicFile) formData.append("profile_pic", profilePicFile);
      if (coverPhotoFile) formData.append("cover_photo", coverPhotoFile);

      const response = await axios.put("/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data?.success) {
        showAlert("Update failed. Please try again.", "error");
        return;
      }

      // Update state with new user data
      dispatch(update(response.data.user));
      setProfilePicPreview(response.data.user.profile_pic);
      setCoverPhotoPreview(response.data.user.cover_photo);
      setProfilePicFile(null);
      setCoverPhotoFile(null);
      setLoading(prev => !prev);
      showAlert("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      showAlert(
        error.response?.data?.message || "Update failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-lg mt-10 mb-10">
      {/* Cover Photo Section */}
      <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden mb-10">
        {coverPhotoPreview && (
          <img
            src={coverPhotoPreview}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <label
          htmlFor="coverPhoto"
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer"
        >
          <input
            type="file"
            id="coverPhoto"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setCoverPhotoFile(file);
                setCoverPhotoPreview(URL.createObjectURL(file));
              }
            }}
          />
          <FaCamera size={18} />
        </label>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-4">
        <label htmlFor="profilePic" className="relative cursor-pointer">
          <input
            type="file"
            id="profilePic"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfilePicFile(file);
                setProfilePicPreview(URL.createObjectURL(file));
              }
            }}
          />
          <div className="relative">
            <img
              src={profilePicPreview || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full">
              <FaCamera size={16} className="text-white" />
            </div>
          </div>
        </label>
      </div>

      {/* Update Form */}
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        {/* Read-only Email Field */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ""}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* College Name */}
        <div>
          <label htmlFor="collegeName" className="block font-semibold mb-1">
            College Name
          </label>
          <input
            type="text"
            id="collegeName"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="branch" className="block font-semibold mb-1">
            Branch
          </label>
          <input
            type="text"
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Roll Number */}
        <div>
          <label htmlFor="rollNumber" className="block font-semibold mb-1">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Domains Selection */}
        <div>
          <label className="block font-semibold mb-2">Areas of Interest</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {domains.map((domain) => (
              <label
                key={domain}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={domain}
                  checked={selectedDomains.includes(domain)}
                  onChange={handleDomainChange}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span className="text-sm">{domain}</span>
              </label>
            ))}
          </div>
        </div>

        {/* GitHub Link */}
        <div>
          <label htmlFor="githubLink" className="block font-semibold mb-1">
            GitHub Profile
          </label>
          <input
            type="url"
            id="githubLink"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="https://github.com/yourusername"
          />
        </div>

        {/* LinkedIn Link */}
        <div>
          <label htmlFor="linkedinLink" className="block font-semibold mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedinLink"
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold cursor-pointer ${loading ? "cursor-not-allowed" : null}`}
        >
          {loading ? <SmallSpinner color="#fff"/> : "Update Profile"}
        </button>
      </form>
    </div>
  );
}