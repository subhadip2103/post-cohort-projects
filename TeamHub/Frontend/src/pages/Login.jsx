import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  
  return (
    <div>
      {mode === "login" ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>

          {error && <p>{error}</p>}

          <p onClick={() => setMode("signup")}>
            Don’t have an account? Sign up
          </p>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Signup</button>

          <p onClick={() => setMode("login")}>Already have an account? Login</p>
        </>
      )}
    </div>
  );
}
