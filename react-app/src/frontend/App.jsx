import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from "./mainApp/topbar.jsx";
import ResourcePage from "./mainApp/resources.jsx";
import Home from "./mainApp/home.jsx";
import Notifications from "./mainApp/notifications.jsx";
import Login from "./mainApp/login.jsx";
import Signup from "./mainApp/signUp.jsx";
import CampusHubAssistantChat from "./mainApp/assistant.jsx";
import StudentDashboard from "./mainApp/progressTracker.jsx";
function App() {
	return (
		<BrowserRouter>
			<TopBar />
			<Routes>
				<Route path="/dashboard" element={<StudentDashboard />}></Route>
				<Route path="/" element={<Home />} />
				<Route path="/resources" element={<ResourcePage />}></Route>
				<Route path="/ai" element={<CampusHubAssistantChat />}></Route>
				<Route path="/notifications" element={<Notifications />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/signUp" element={<Signup />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
