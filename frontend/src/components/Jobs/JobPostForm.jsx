import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { includeJob } from "../../redux/slices/jobs.slice";
import {SmallSpinner} from "../index"

const JobPostForm = ({ showAlert = () => {} }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    positionType: "Full-time",
    jobType: "Job",
    deadline: "",
    description: "",
    contactEmail: "",
    applyLink: "",
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      setLoading((prev) => !prev);
      const response = await axios.post("/api/jobs/create-job", formData);
      console.log("Response for posting job:",response);

      if (!response.data.success) {
        showAlert(response.data.message || "Something went wrong!", "error");
      } else {
        dispatch(includeJob([response.data.data]));
        showAlert("Posted Successfully!","success");
      }
    } catch (error) {
      console.log("In catch block",error);
      console.log(error.message);
      showAlert("Something went wrong!", "error");
    } finally {
      setLoading((prev) => !prev);
      setFormData({
        jobTitle: "",
        company: "",
        location: "",
        positionType: "Full-time",
        jobType: "Job",
        deadline: "",
        description: "",
        contactEmail: "",
        applyLink: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Post Job/Internship Opportunity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            {/* Position Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.positionType}
                onChange={(e) =>
                  setFormData({ ...formData, positionType: e.target.value })
                }
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>

            {/* Job/Internship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opportunity Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({ ...formData, jobType: e.target.value })
                }
              >
                <option>Job</option>
                <option>Internship</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
              />
            </div>

            {/* Apply Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://careers.company.com/apply"
                value={formData.applyLink}
                onChange={(e) =>
                  setFormData({ ...formData, applyLink: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Include responsibilities, requirements, benefits..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {
              loading ? <SmallSpinner/> : "Post Oppurtunity"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
