import React from "react";
import { useSelector } from "react-redux";
import { SmallSpinner, Logout } from "../index";

function Dashboard({ showAlert }) {
  const user  = useSelector((state) => state.user);
  // console.log(user);


  return (
    <>
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-xl rounded-lg p-6 w-80">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-500">This is your dashboard.</p>
        </div>
      </div>
      <Logout showAlert={showAlert}/>
    </div>
    {/* <SmallSpinner/> */}
    </>
  );
}

export default Dashboard;
