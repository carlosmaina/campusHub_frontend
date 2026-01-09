import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../mainCss/dashboard.css";

const StudentDashboard = () => {
	let [st, reset_st] = useState(
		() => JSON.parse(localStorage.getItem("user")) || []
	);
	const student = {
		name: `${st.name} ${st.lname}`,
		course: "Bachelor of Science (ICT)",
		year: "Year 2, Semester 1",
		reg: "RU/SC/2023/0190",
		email: st.email,
	};

	const stats = [
		{ label: "Completed Units", value: 10 },
		{ label: "Pending Units", value: 4 },
		{ label: "Study Hours (Weekly)", value: "14 hrs" },
		{ label: "Performance", value: "78%" },
	];

	const barData = {
		labels: ["Math", "ICT", "Physics", "History", "English"],
		datasets: [
			{
				label: "Grades (%)",
				data: [80, 75, 67, 90, 72],
				backgroundColor: "#0b132b",
				borderRadius: 6,
			},
		],
	};

	const lineData = {
		labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
		datasets: [
			{
				label: "Study Hours",
				data: [12, 10, 15, 14],
				borderColor: "#0b132b",
				tension: 0.3,
			},
		],
	};

	return (
		<div className="w3-dashboard-container">
			{/* Header */}
			<header className="w3-header">
				<h2>Student Dashboard</h2>
			</header>

			{/* Student Info */}
			<section className="student-info">
				<h3>Student Information</h3>

				<table className="info-table">
					<tbody>
						<tr>
							<th>Name</th>
							<td>{student.name}</td>
						</tr>
						<tr>
							<th>Course</th>
							<td>{student.course}</td>
						</tr>
						<tr>
							<th>Year</th>
							<td>{student.year}</td>
						</tr>
						<tr>
							<th>Registration No.</th>
							<td>{student.reg}</td>
						</tr>
						<tr>
							<th>Email</th>
							<td>{student.email}</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* Stats */}
			<section className="stats-section">
				{stats.map((s, index) => (
					<div key={index} className="stat-card">
						<h4>{s.label}</h4>
						<p>{s.value}</p>
					</div>
				))}
			</section>

			{/* Charts */}
			<section className="charts-section">
				<div className="chart-card">
					<h3>Performance Overview</h3>
					<Bar data={barData} />
				</div>

				<div className="chart-card">
					<h3>Weekly Study Hours</h3>
					<Line data={lineData} />
				</div>
			</section>
		</div>
	);
};

export default StudentDashboard;
