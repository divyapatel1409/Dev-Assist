import React from "react";
import Sidebar from "./sidebar"
import RequestPanel from "./ResponsePanel";
import ResponsePanel from "./RequestPanel";

const BodyContainer = () => {
  
  return (
    <div className="flex h-screen text-black p-4">
        {/* Left Sidebar block */}
        <Sidebar />
        
        {/* Main Content block*/}
        <div className="flex flex-col flex-grow">
            {/*Right panel top block*/}
            <RequestPanel/>

            {/* Right panel bottom block*/}
            <ResponsePanel/>
        </div>
    </div>
  );
};

export default BodyContainer;
