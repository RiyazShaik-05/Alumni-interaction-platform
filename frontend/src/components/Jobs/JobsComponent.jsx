import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { includeInAllJobs } from "../../redux/slices/jobs.slice";
import axios from "axios";
import { JobCard, SmallSpinner } from "../index";
import JobPostForm from "./JobPostForm";

const JobsComponent = ({ showAlert = () => {} }) => {
  const allJobs = useSelector((state) => state.jobs.allJobs || []);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const { user_type } = useSelector(state => state.user?.user || {});

  const fetchJobs = async (pageNumber, reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/jobs/get-all-jobs?page=${pageNumber}&limit=5`
      );

      if (!response?.data?.success) {
        showAlert("Internal server error", "error");
        return;
      }

      const jobs = response.data.jobs || [];
      const totalJobs = response.data.totalCount || 0;

      if (reset) {
        dispatch(includeInAllJobs(jobs));
      } else {
        const newJobs = jobs.filter(
          job => !allJobs.some(existingJob => existingJob._id === job._id)
        );
        if (newJobs.length > 0) {
          dispatch(includeInAllJobs(newJobs));
        }
      }

      setHasMore((reset ? jobs.length : allJobs.length + jobs.length) < totalJobs);
    } catch (error) {
      showAlert("Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleJobPostSuccess = () => {
    setCurrentPage(1);
    fetchJobs(1, true);
  };

  useEffect(() => {
    if (initialLoad && allJobs.length === 0) {
      fetchJobs(1);
    }
  }, [initialLoad, allJobs.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !loading) {
          setCurrentPage(prev => {
            const nextPage = prev + 1;
            fetchJobs(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-50">
      {user_type === "alumni" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <JobPostForm showAlert={showAlert}/>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {user_type === "alumni" ? "Posted Opportunities" : "Available Opportunities"}
        </h1>

        {initialLoad ? (
          <div className="py-8 flex justify-center">
            <SmallSpinner />
          </div>
        ) : (
          <>
            {allJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600 text-lg">
                  {user_type === "alumni" 
                    ? "You haven't posted any opportunities yet" 
                    : "No opportunities available yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {allJobs.slice().reverse().map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showAlert={showAlert}
                  />
                ))}
              </div>
            )}

            {loading && (
              <div className="py-8 flex justify-center">
                <SmallSpinner />
              </div>
            )}

            {!hasMore && allJobs.length > 0 && (
              <p className="text-center text-gray-500 py-6">
                No more opportunities to load
              </p>
            )}
          </>
        )}

        <div ref={loaderRef} className="h-2" />
      </div>
    </div>
  );
};

export default JobsComponent;