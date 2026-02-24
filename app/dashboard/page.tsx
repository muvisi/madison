"use client";

import { getCurrentUser } from "../../src/services/auth";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardHome() {
  const username = getCurrentUser() || "Guest";

  const sections = [
    "Members",
    "Benefits",
    "Categories",
    "Copays",
    "Waiting Periods",
    "Restrictions",
  ];

  const chartData = sections.map((sec, i) => ({
    name: sec,
    value: Math.floor(Math.random() * 100) + 10,
  }));

  const pieColors = ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"];

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      {/* Top welcome */}
      <div className="mt-4 ml-6 md:ml-12">
        <p className="text-2xl md:text-3xl font-bold text-blue-900">
          Welcome, {username}!
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col items-center px-4 md:px-12 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {sections.map((section) => (
            <div
              key={section}
              className="flex items-center justify-center h-28 md:h-32 bg-blue-200/30 text-blue-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2 cursor-pointer"
            >
              {section}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col items-center px-4 md:px-12 mt-8 mb-12">
        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
          Dashboard Charts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-blue-900 font-semibold mb-2">Line Chart</h4>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-blue-900 font-semibold mb-2">Pie Chart</h4>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={60}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-blue-900 font-semibold mb-2">Bar Chart</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}