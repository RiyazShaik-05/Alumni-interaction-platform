import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

const SearchUser = ({ showAlert = () => {} }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {_id} = useSelector(state=>state.user.user);

  const handleUserClick = (userID) => {
    if(_id === userID) {
      navigate("/dashboard");
      return;
    }
    navigate(`/profile/${userID}`)
  }

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading((prev) => !prev);
        const response = await axios.get(
          `api/auth/get-all-users?name=${query}`
        );
        if (!response.data.success) {
          showAlert("Something went wrong!", "error");
        } else {
          setUsers(response.data.users);
        }

        console.log(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading((prev) => !prev);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto m-2">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}
      {users.length === 0 ? (
        !query ? null : (
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer">
            <span className="text-gray-900">No users Found</span>
          </li>
        )
      ) : (
        <ul className="absolute w-full bg-white border border-gray-200 rounded-md shadow-md mt-1">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={()=>handleUserClick(user._id)}
            >
              <img
                src={user.profile_pic || "/default-avatar.png"}
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-900">{user.full_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUser;
