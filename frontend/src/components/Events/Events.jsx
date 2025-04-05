// import React from 'react'
// import {EventPostForm} from "../index"
// import { useSelector } from 'react-redux'
// import EventCard from './EventCard';

// const Events = ({showAlert = ()=>{}}) => {
//   const {user_type} = useSelector(state=>state.user.user);
//   const allEvents = useSelector(state => state.events.allEvents);
//   console.log(allEvents);
//   console.log(user_type)
//   return (
//     <>
//       {
//         user_type === "alumni" && <EventPostForm showAlert={showAlert}/>
//       }
//       {
//           allEvents && allEvents.length === 0 ? <h1>No Events!</h1> : (
//             allEvents.slice().reverse().map((event)=>(
//               <EventCard key={event._id} event={event}/>
//             ))
//           )
//         }
//     </>
//   )
// }

// export default Events


import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { includeInAllEvents } from "../../redux/slices/events.slice";
import axios from "axios";
import { EventCard, SmallSpinner, EventPostForm } from "../index";

const EventsComponent = ({ showAlert = () => {} }) => {
  const allEvents = useSelector((state) => state.events.allEvents || []);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const { user_type } = useSelector(state => state.user?.user || {});

  console.log("All events: ",allEvents);

  const fetchEvents = async (pageNumber, reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/Events/get-all-events?page=${pageNumber}&limit=5`
      );

      if (!response?.data?.success) {
        showAlert("Internal server error", "error");
        return;
      }

      const Events = response.data.Events || [];
      const totalEvents = response.data.totalCount || 0;

      if (reset) {
        dispatch(includeInAllEvents(Events));
      } else {
        const newEvents = Events.filter(
          Event => !allEvents.some(existingEvent => existingEvent._id === Event._id)
        );
        if (newEvents.length > 0) {
          dispatch(includeInAllEvents(newEvents));
        }
      }

      setHasMore((reset ? Events.length : allEvents.length + Events.length) < totalEvents);
    } catch (error) {
      showAlert("Failed to fetch Events", "error");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleEventPostSuccess = () => {
    setCurrentPage(1);
    fetchEvents(1, true);
  };

  useEffect(() => {
    if (initialLoad && allEvents.length === 0) {
      fetchEvents(1);
    }
  }, [initialLoad, allEvents.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !loading) {
          setCurrentPage(prev => {
            const nextPage = prev + 1;
            fetchEvents(nextPage);
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
          <EventPostForm showAlert={showAlert}/>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {user_type === "alumni" ? "Posted Events" : "Current Events"}
        </h1>

        {initialLoad ? (
          <div className="py-8 flex justify-center">
            <SmallSpinner />
          </div>
        ) : (
          <>
            {allEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600 text-lg">
                  {user_type === "alumni" 
                    ? "You haven't posted any Events yet" 
                    : "No opportunities Events yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {allEvents.slice().reverse().map(Event => (
                  <EventCard
                    key={Event._id}
                    event={Event}
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

            {!hasMore && allEvents.length > 0 && (
              <p className="text-center text-gray-500 py-6">
                No more Events!
              </p>
            )}
          </>
        )}

        <div ref={loaderRef} className="h-2" />
      </div>
    </div>
  );
};

export default EventsComponent;