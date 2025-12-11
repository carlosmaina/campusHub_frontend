import topStyle from "../mainCss/home.module.css";
import "../mainCss/chat.css";
import { useState } from "react";
import CampusHubAssistantChat from "./assistant";

function Home() {
	let [active, reset] = useState(false);

	return (
		<div className={topStyle.homePage}>
			{/* Chat Button */}
			<div className={`${active === true ? "all-gt " : ""}`}>
				<div
					className="chat-cont"
					title="Assistant"
					onClick={() => reset(!active)}
				>
					<i className="fas fa-comment"></i>
				</div>

				{active && (
					<div className="display">
						<CampusHubAssistantChat stack={reset} reset={reset} />
					</div>
				)}
			</div>

			<div className={topStyle.homeContent}>
				{/* ================= HERO SECTION ================= */}
				<section className={topStyle.hero}>
					<div className={topStyle.heroText}>
						<h1>CampusHub</h1>
						<p className={topStyle.heroSub}>
							Unlock knowledge. Share resources. Empower your campus.
						</p>

						<div className={topStyle.heroBtns}>
							<button className={topStyle.exploreBtn}>Explore Resources</button>
							<button className={topStyle.uploadBtn}>Upload Material</button>
						</div>
					</div>
				</section>

				{/* ================= TOP CATEGORIES ================= */}
				<section className={topStyle.categories}>
					<h2>Top Categories</h2>
					<div className={topStyle.catGrid}>
						<div className={topStyle.catCard}>
							<i className="fa-solid fa-book-open"></i>
							<h3>Lecture Notes</h3>
							<p>Summaries, notes & class references for all units.</p>
						</div>

						<div className={topStyle.catCard}>
							<i className="fa-solid fa-file-lines"></i>
							<h3>Past Papers</h3>
							<p>Prep for exams with previous CAT & exam papers.</p>
						</div>

						<div className={topStyle.catCard}>
							<i className="fa-solid fa-laptop-code"></i>
							<h3>Programming Projects</h3>
							<p>Real code samples from real student projects.</p>
						</div>

						<div className={topStyle.catCard}>
							<i className="fa-solid fa-pen-ruler"></i>
							<h3>Assignments</h3>
							<p>Completed tasks and guides to help improve your work.</p>
						</div>
					</div>
				</section>

				{/* ================= TRENDING SECTION ================= */}
				<section className={topStyle.trending}>
					<h2>Trending Right Now</h2>
					<div className={topStyle.trendingGrid}>
						<div className={topStyle.trendCard}>
							<h4>📘 Web Development Notes</h4>
							<p>HTML, CSS, JS full semester compilation.</p>
						</div>
						<div className={topStyle.trendCard}>
							<h4>📝 Business CAT Past Papers</h4>
							<p>Past papers from 2021 - 2024.</p>
						</div>
						<div className={topStyle.trendCard}>
							<h4>💻 Final Year Projects</h4>
							<p>Top-rated system development projects.</p>
						</div>
					</div>
				</section>

				{/* ================= WHY CAMPUSHUB ================= */}
				<section className={topStyle.why}>
					<h2>Why Students Love CampusHub</h2>
					<div className={topStyle.whyGrid}>
						<div className={topStyle.whyCard}>
							<i className="fa-solid fa-bolt"></i>
							<h3>Fast Access</h3>
							<p>Find relevant study materials in seconds.</p>
						</div>
						<div className={topStyle.whyCard}>
							<i className="fa-solid fa-users"></i>
							<h3>Community Powered</h3>
							<p>Students help students level up together.</p>
						</div>
						<div className={topStyle.whyCard}>
							<i className="fa-solid fa-shield-heart"></i>
							<h3>Secure Uploads</h3>
							<p>Your files are protected & always backed up.</p>
						</div>
					</div>
				</section>

				{/* ================= TESTIMONIALS ================= */}
				<section className={topStyle.testimonials}>
					<h2>Student Feedback</h2>
					<div className={topStyle.testiRow}>
						<div className={topStyle.testCard}>
							<p>
								“CampusHub helped me get notes I missed when I was sick. Total
								lifesaver.”
							</p>
							<h4>— Brian, CS Student</h4>
						</div>

						<div className={topStyle.testCard}>
							<p>
								“The past papers section is crazy helpful during exam week.
								10/10.”
							</p>
							<h4>— Mercy, Business Student</h4>
						</div>

						<div className={topStyle.testCard}>
							<p>
								“Uploaded my project and got recognized by the entire class.”
							</p>
							<h4>— Kelvin, IT Student</h4>
						</div>
					</div>
				</section>

				{/* ================= FEATURES ================= */}
				<section className={topStyle.features}>
					<h2>Platform Highlights</h2>
					<div className={topStyle.featureGrid}>
						<div className={topStyle.featureCard}>
							<h3>
								<i className="fa-solid fa-cloud-arrow-up"></i> Upload
							</h3>
							<p>Share your notes, projects, and past papers effortlessly.</p>
						</div>

						<div className={topStyle.featureCard}>
							<h3>📂 Browse by Category</h3>
							<p>Instant access to organized study materials.</p>
						</div>

						<div className={topStyle.featureCard}>
							<h3>
								<i className="fa-solid fa-bell"></i> Notifications
							</h3>
							<p>Get notified when new uploads match your interests.</p>
						</div>

						<div className={topStyle.featureCard}>
							<h3>
								<i className="fa-solid fa-user-gear"></i> Admin Tools
							</h3>
							<p>Manage users, uploads & system settings.</p>
						</div>
					</div>
				</section>

				{/* ================= FOOTER ================= */}
				<footer className={topStyle.footer}>
					<p>
						© {new Date().getFullYear()} CampusHub | Empowering Students
						Digitally
					</p>
				</footer>
			</div>
		</div>
	);
}

export default Home;
