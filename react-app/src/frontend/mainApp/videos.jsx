import React, { useState } from "react";
import "../mainCss/VideoGallery.css";

function VideoGallery() {
	const [playingVideo, setPlayingVideo] = useState(null);

	const videos = [
		{
			id: 1,
			title: "Tech Ethics Documentary",
			duration: "45:30",
			date: "March 12, 2024",
			category: "Technology",
			views: "15.2K",
			description:
				"An in-depth look at ethical considerations in modern technology development.",
		},
		{
			id: 2,
			title: "Urban Development Series",
			duration: "28:15",
			date: "March 8, 2024",
			category: "Infrastructure",
			views: "8.7K",
			description:
				"Exploring innovative approaches to sustainable urban planning.",
		},
		{
			id: 3,
			title: "Climate Change Report",
			duration: "32:45",
			date: "February 28, 2024",
			category: "Environment",
			views: "12.4K",
			description:
				"Documenting the effects of climate change across different regions.",
		},
		{
			id: 4,
			title: "Political Analysis Roundtable",
			duration: "56:20",
			date: "February 15, 2024",
			category: "Politics",
			views: "9.3K",
			description:
				"Expert discussion on current political landscapes and future predictions.",
		},
		{
			id: 5,
			title: "Cultural Heritage Preservation",
			duration: "38:10",
			date: "January 30, 2024",
			category: "Culture",
			views: "6.8K",
			description: "Efforts to preserve cultural heritage in the digital age.",
		},
		{
			id: 6,
			title: "Healthcare Innovations",
			duration: "41:55",
			date: "January 18, 2024",
			category: "Health",
			views: "11.1K",
			description: "Breakthrough technologies and methodologies in healthcare.",
		},
	];

	const categories = [
		"All",
		"Computer Science",
		"Informatics",
		"Information Science",
		"Coding Projects",
	];
	const [selectedCategory, setSelectedCategory] = useState("All");

	const filteredVideos =
		selectedCategory === "All"
			? videos
			: videos.filter((video) => video.category === selectedCategory);

	return (
		<div className="video-gallery">
			<h1 className="section-title" style={{textAlign:"center",paddingTop:"100px",color:"white"}}>Learning Videos</h1>

			<div className="video-header">
				<div className="category-tabs">
					{categories.map((category) => (
						<button
							key={category}
							className={`category-tab ${
								selectedCategory === category ? "active" : ""
							}`}
							onClick={() => setSelectedCategory(category)}
						>
							{category}
						</button>
					))}
				</div>

				{/* <div className="sort-options">
					<select onChange={(e) => console.log("Sort by:", e.target.value)}>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="popular">Most Viewed</option>
						<option value="duration">Duration</option>
					</select>
				</div> */}
			</div>
			{filteredVideos.length === 0 && (
				<div className="no-videos">
					<div className="no-videos-icon">🎬</div>
					<h3>No videos available in this category</h3>
					<p>New content is being prepared. Check back soon!</p>
				</div>
			)}
		</div>
	);
}

export default VideoGallery;
