import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Team from "./pages/Team.jsx";
import Project from "./pages/Project.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Project/>
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
