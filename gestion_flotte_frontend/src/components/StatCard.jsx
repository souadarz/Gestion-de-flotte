import React from 'react'

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`text-4xl ${color}`}>{icon}</div>
  </div>
);

export default StatCard