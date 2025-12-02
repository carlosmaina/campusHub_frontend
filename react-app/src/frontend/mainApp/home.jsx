import topStyle from "../mainCss/home.module.css";
import "../mainCss/chat.css";
import { useState } from "react";
import CampusHubAssistantChat from "./assistant";
function Home() {
	let [active, reset] = useState(false);
	return (
		<div className={topStyle.homePage}>
			<div
				className="chat-cont"
				title="Assistant"
				onClick={() => reset(!active)}
			>
				<i className="fas fa-comment"></i>
			</div>
			{active && (
				<div className="display">
					{<CampusHubAssistantChat stack={reset} reset={reset}/>}
				</div>
			)}
			<div className={topStyle.homeContent}>
				{/* Hero Section */}
				<section className={topStyle.hero}>
					<div className={topStyle.heroText}>
						<h1>Welcome to CampusHub</h1>
						<p>
							Your one-stop platform for sharing and accessing academic
							materials — from notes and past papers to coding projects.
						</p>
						<div className={topStyle.heroBtns}>
							<button className={topStyle.exploreBtn}>Explore Resources</button>
							<button className={topStyle.uploadBtn}>Upload Material</button>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className={topStyle.features}>
					<h2>Platform Highlights</h2>
					<div className={topStyle.featureGrid}>
						<div className={topStyle.featureCard}>
							<h3>
								{" "}
								<i className="fa-solid fa-cloud-arrow-up"></i> Upload
							</h3>
							<p>Share your notes, projects, and past papers effortlessly.</p>
						</div>
						<div className={topStyle.featureCard}>
							<h3>📂 Browse by Category</h3>
							<p>Quickly find what you need — Notes, Projects, or Papers.</p>
						</div>
						<div className={topStyle.featureCard}>
							<h3>
								{" "}
								<i className="fa-solid fa-bell"></i> Notifications
							</h3>
							<p>Stay updated when new academic materials are uploaded.</p>
						</div>
						<div className={topStyle.featureCard}>
							<h3>
								<i className="fa-solid fa-user-gear"></i> Admin Dashboard
							</h3>
							<p>Managed uploads, users, and categories with ease.</p>
						</div>
					</div>
				</section>

				{/* Footer */}
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
