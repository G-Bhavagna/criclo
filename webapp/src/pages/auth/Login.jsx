import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { COLORS, DEMO_CREDENTIALS } from "../../config/constants";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1
            style={{
              fontSize: "48px",
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, #8B5FE3 50%, #B94FE8 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            Circlo
          </h1>
          <p style={{ color: COLORS.textSecondary, fontSize: "18px" }}>
            Connect with neighbors for everyday activities
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={fillDemoCredentials}
          >
            Use Demo Account
          </button>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: COLORS.primary }}>
              Sign up
            </Link>
          </div>
        </form>

        <div className="demo-info">
          <p style={{ fontSize: "14px", color: COLORS.textSecondary }}>
            <strong>Demo Credentials:</strong>
            <br />
            Email: {DEMO_CREDENTIALS.email}
            <br />
            Password: {DEMO_CREDENTIALS.password}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
