import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const CampusHubDashboard = () => {
  // 📊 Bar Chart: Course Completion
  const completionData = {
    labels: ["Math", "Science", "History", "English", "ICT"],
    datasets: [
      {
        label: "Completion (%)",
        data: [80, 65, 90, 75, 50],
        backgroundColor: "#4caf50",
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Course Completion Tracker" },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  // 📈 Line Chart: Weekly Study Hours
  const studyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Study Hours",
        data: [12, 15, 10, 18],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const studyOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Weekly Study Hours" },
    },
  };

  // 🍩 Doughnut Chart: Course Distribution
  const distributionData = {
    labels: ["Math", "Science", "History", "English", "ICT"],
    datasets: [
      {
        label: "Course Distribution",
        data: [25, 20, 15, 25, 15],
        backgroundColor: [
          "#f44336",
          "#2196f3",
          "#ff9800",
          "#4caf50",
          "#9c27b0",
        ],
      },
    ],
  };

  const distributionOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Course Distribution" },
      legend: { position: "bottom" },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>📚 CampusHub Learner Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "400px" }}>
          <Bar data={completionData} options={completionOptions} />
        </div>

        <div style={{ width: "400px" }}>
          <Line data={studyData} options={studyOptions} />
        </div>

        <div style={{ width: "300px" }}>
          <Doughnut data={distributionData} options={distributionOptions} />
        </div>
      </div>
    </div>
  );
};

export default CampusHubDashboard;
