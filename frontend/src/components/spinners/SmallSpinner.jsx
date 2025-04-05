import React from "react";

function SmallSpinner({color  = "blue-500"}) {
  return (
    <>
      <div className="h-fit flex flex-col rounded-xl">
        <div className="flex flex-auto flex-col justify-center items-center">
          <div className="flex justify-center">
            <div
              className={`animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-${color} rounded-full`}
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SmallSpinner;
