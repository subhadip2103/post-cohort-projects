import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/base";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/teams">Teams</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
