import React, { useState } from "react";

const EventCard = ({ event }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <>
      {event && (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden p-6 mb-6 border border-gray-100">
          {/* Card Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="mb-2 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900">
                {event.eventName}
              </h3>
              <p className="text-gray-600 mt-1">Hosted by {event.host}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.isVirtual
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {event.isVirtual ? "Virtual Event" : "In-Person Event"}
            </span>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-800">
                  {new Date(event.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">
                  {event.isVirtual ? "Online Meeting" : "Location"}
                </p>
                {event.isVirtual ? (
                  <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    Join Event
                  </a>
                ) : (
                  <p className="font-medium text-gray-800">{event.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p
              className={`text-gray-700 leading-relaxed ${
                showFullDescription ? "" : "line-clamp-3"
              }`}
            >
              {event.description}
            </p>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                Posted {new Date().toLocaleDateString()}
              </span>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              <span>View Details</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
