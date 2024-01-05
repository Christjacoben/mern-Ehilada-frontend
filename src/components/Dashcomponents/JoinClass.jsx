import React, { useState } from "react";

function JoinClass() {
  const [classCode, setClassCode] = useState("");

  const handleJoinClass = () => {
    // Handle API call to join class using classCode
  };

  return (
    <div>
      <h2>Join Class</h2>
      <input
        type="text"
        placeholder="Enter Class Code"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
      />
      <button onClick={handleJoinClass}>Join</button>
    </div>
  );
}

export default JoinClass;
