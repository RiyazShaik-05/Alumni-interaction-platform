import React from "react";

const JobCard = ({ job }) => {

  // console.log(job)
  return (
    <>
      {job && (
        <div className="bg-white  rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden p-6 mb-6">
          {/* Card Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {job?.jobTitle}
              </h3>
              <p className="text-lg text-gray-600 font-medium">
                {job?.company}
              </p>
            </div>
            <span
              className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium 
          ${
            job?.jobType === "Internship"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
            >
              {job?.jobType}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
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
              <span className="text-gray-600">{job?.location}</span>
            </div>

            <div className="flex items-center space-x-2">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-600">{job?.positionType}</span>
            </div>

            <div className="flex items-center space-x-2">
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
              <span className="text-gray-600">
                Apply by: {new Date(job?.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-600">{job?.contactEmail}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 line-clamp-3">{job?.description}</p>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <a
              href={job?.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-center transition-colors duration-200"
            >
              Apply Now
            </a>
            <span className="text-sm text-gray-500 md:text-right">
              Posted {new Date().toLocaleDateString()}{" "}
              {/* You might want to add actual posting date */}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
