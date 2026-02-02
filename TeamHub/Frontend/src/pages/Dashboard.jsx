import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate=useNavigate()

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
  <div>
    <h2>Welcome, {user.UserName}</h2>;
    <button onClick={() => navigate("/teams")}>My Teams</button>
    <button onClick={logout}>Logout</button>
  </div>);
}
