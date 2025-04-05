import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { includeEvent } from "../../redux/slices/events.slice.js";
import axios from "axios";
import SmallSpinner from "../spinners/SmallSpinner";

const EventPostForm = ({ showAlert = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    host: "",
    isVirtual: false,
    eventLink: "",
    location: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.eventName==="" || formData.date==="" || formData.host==="" || formData.description===""){
      showAlert("All fields required!","Error");
      return;
    }

    try {
      setLoading((prev) => !prev);
      console.log(formData)
      const response = await axios.post("/api/events/create-event", formData);
      console.log(response);
      if (!response.data.success) {
        showAlert(response.data.message || "Something went wrong!","error");
      } else {
        dispatch(includeEvent([response.data.event]));
        setFormData({
          eventName: "",
          date: "",
          host: "",
          isVirtual: false,
          eventLink: "",
          location: "",
          description: "",
        })
        showAlert("Event Created Successfully!","success");
      }
    } catch (error) {
      showAlert("Something went wrong!","error");
      console.log(error.message)
    } finally {
      setLoading(prev => !prev)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Post New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.eventName}
                onChange={(e) =>
                  setFormData({ ...formData, eventName: e.target.value })
                }
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            {/* Host */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host/Organizer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.host}
                onChange={(e) =>
                  setFormData({ ...formData, host: e.target.value })
                }
              />
            </div>

            {/* Virtual/Physical Toggle */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Event Type:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isVirtual: !formData.isVirtual })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.isVirtual ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isVirtual ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {formData.isVirtual ? "Virtual Event" : "Physical Event"}
                </span>
              </div>
            </div>

            {/* Virtual Event Link */}
            {formData.isVirtual && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required={formData.isVirtual}
                  pattern="https?://.*"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://meet.example.com/event123"
                  value={formData.eventLink}
                  onChange={(e) =>
                    setFormData({ ...formData, eventLink: e.target.value })
                  }
                />
              </div>
            )}

            {/* Physical Location */}
            {!formData.isVirtual && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required={!formData.isVirtual}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, Country"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the event, agenda, special guests, etc."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
          >
            {loading ? <SmallSpinner/> : "Post Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventPostForm;
