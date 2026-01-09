import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from "./mainApp/topbar.jsx";
import VideoGallery from "./mainApp/videos.jsx";
import Home from "./mainApp/home.jsx";
import ResourcePage from "./mainApp/resources.jsx";
import Notifications from "./mainApp/notifications.jsx";
import CampusHubAssistantChat from "./mainApp/assistant.jsx";
import StudentDashboard from "./mainApp/progressTracker.jsx";

import Login from "./mainApp/login.jsx";
import Signup from "./mainApp/signUp.jsx";

/* Layout that includes TopBar */
function AppLayout({ children }) {
	return (
		<>
			<TopBar />
			{children}
		</>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* PUBLIC ROUTES */}
				<Route path="/login" element={<Login />} />
				<Route path="/signUp" element={<Signup />} />

				{/* APP ROUTES */}
				<Route
					path="/"
					element={
						<AppLayout>
							<Home />
						</AppLayout>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<AppLayout>
							<StudentDashboard />
						</AppLayout>
					}
				/>

				<Route
					path="/resources"
					element={
						<AppLayout>
							<ResourcePage />
						</AppLayout>
					}
				/>
				<Route
					path="videos"
					element={
						<AppLayout>
							<VideoGallery />
						</AppLayout>
					}
				></Route>
				<Route
					path="/ai"
					element={
						<AppLayout>
							<CampusHubAssistantChat />
						</AppLayout>
					}
				/>

				<Route
					path="/notifications"
					element={
						<AppLayout>
							<Notifications />
						</AppLayout>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
