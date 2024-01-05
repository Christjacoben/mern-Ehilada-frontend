import React from "react";

function TeacherCard({ className, code, name, section, subject }) {
  return (
    <div className={className}>
      <div className="card-headers">
        <h3>{name}</h3>\<span>Section:{section}</span>
      </div>

      <div className="card-content">
        <p>Subject:{subject}</p>
        <p>ClassCode : {code}</p>
      </div>
    </div>
  );
}

export default TeacherCard;
