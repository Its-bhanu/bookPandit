import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";

// ✅ Custom tooltip showing extra info
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const pandit = payload[0].payload;
    return (
      <div className="bg-white border p-2 rounded shadow text-sm">
        <p><strong>{pandit.fullname}</strong></p>
        <p>📞 Mobile: {pandit.mobile}</p>
        <p>📊 Bookings: {pandit.totalBookings}</p>
      </div>
    );
  }
  return null;
};

export default function PanditBookingGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://book-pandit-mmed.vercel.app/api/stats/most-booked-pandits")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full h-[450px] p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-center mb-4">
        📊 Show Most Recent Booked Pandits According to the Graph 
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="fullname" type="category" width={150} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalBookings" fill="#82ca9d">
            {/* ✅ show booking numbers inside bars */}
            <LabelList dataKey="totalBookings" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
