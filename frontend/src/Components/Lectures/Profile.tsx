import React from "react";

const Profile = () => {
  const lecturer = {
    name: '',
    email: '',
    scheduleType: '',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Profile</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {lecturer.name}</p>
        <p><strong>Email:</strong> {lecturer.email}</p>
        <p><strong>Schedule Type:</strong> {lecturer.scheduleType}</p>
      </div>
    </div>
  );
};

export default Profile;
