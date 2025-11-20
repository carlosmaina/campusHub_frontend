import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from "./mainApp/topbar.jsx";
import ResourcePage from "./mainApp/resources.jsx";
import Home from "./mainApp/home.jsx";
import Notifications from "./mainApp/notifications.jsx";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourcePage />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
