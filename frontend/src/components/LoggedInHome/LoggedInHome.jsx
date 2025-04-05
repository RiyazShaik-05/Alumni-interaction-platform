import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { includeInAllPosts } from "../../redux/slices/posts.slice";
import axios from "axios";
import { PostCard, SmallSpinner } from "../index";

const LoggedInHome = ({ showAlert = () => {} }) => {
  const allPosts = useSelector((state) => state.posts.allPosts || []);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const lastRequest = useRef(0);

  const fetchPosts = async (pageNumber) => {
    if (loading || !hasMore || Date.now() - lastRequest.current < 500) return;
    lastRequest.current = Date.now();

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/posts/get-all-posts?page=${pageNumber}&limit=10`
      );

      if (!response?.data?.success) {
        showAlert("Internal server error", "error");
        return;
      }

      const posts = response.data.posts || [];
      const totalPosts = response.data.totalCount || 0;

      // Optimized existing post check
      const existingIds = new Set(allPosts.map(p => p._id));
      const newPosts = posts.filter(post => !existingIds.has(post._id));

      if (newPosts.length > 0) {
        dispatch(includeInAllPosts(newPosts));
      }

      // More accurate hasMore calculation
      setHasMore(allPosts.length + newPosts.length < totalPosts);
    } catch (error) {
      showAlert("Failed to fetch posts", "error");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialLoad && allPosts.length === 0) {
      fetchPosts(1);
    }
  }, [initialLoad, allPosts.length]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !loading) {
          setCurrentPage(prev => {
            const nextPage = prev + 1;
            fetchPosts(nextPage);
            return nextPage;
          });
        }
      },
      { 
        root: null,
        rootMargin: "250px",
        threshold: 0.1
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loading, hasMore]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Community Posts
      </h1>

      <div className="relative">
        {initialLoad ? (
          <div className="py-8 flex justify-center">
            <SmallSpinner />
          </div>
        ) : (
          <>
            {(allPosts?.length || 0) === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No posts to display yet</p>
                <p className="text-gray-400 mt-2">
                  Be the first to share something!
                </p>
              </div>
            ) : (
              <div className="space-y-6 pb-4">
                {allPosts?.map((post) => (
                  <PostCard
                    key={post._id}
                    user={{
                      profile_pic: post.profile_pic,
                      full_name: post.full_name,
                      user_type: post.user_type.charAt(0).toUpperCase() + post.user_type.slice(1)
                    }}
                    post={post}
                    showAlert={showAlert}
                    showDeleteDropdown={false}
                    showBadge={true}
                  />
                ))}
              </div>
            )}

            {loading && (
              <div className="py-8 flex justify-center">
                <SmallSpinner />
              </div>
            )}

            {!hasMore && allPosts?.length > 0 && (
              <p className="text-center text-gray-500 py-6">
                You've reached the end of posts
              </p>
            )}
          </>
        )}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
};

export default React.memo(LoggedInHome);