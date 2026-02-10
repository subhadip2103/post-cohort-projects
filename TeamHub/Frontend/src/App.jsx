import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Team from "./pages/Team.jsx";
import Projects from "./pages/Project.jsx";
import Tasks from "./pages/Task.jsx";
import Notes from "./pages/Note.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* 👇 THIS is the missing piece */}
            <Route index element={<Dashboard />} />

            <Route path="teams" element={<Team />} />
            <Route path="teams/:teamCode/projects" element={<Projects />} />
            <Route path="projects/:projectCode/tasks" element={<Tasks />} />
            <Route path="tasks/:taskCode/notes" element={<Notes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
