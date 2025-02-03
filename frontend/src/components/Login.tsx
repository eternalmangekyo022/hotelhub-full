import { useState } from "react";
import axios from "axios";
import "./styles/login.scss";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");
  
    setError("");
    setSuccess("");
  
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", formData, { headers: { 'Content-Type': 'application/json' } });
      console.log("Response received:", response.data);
  
      setSuccess("User logged in successfully");
      setError("");
      setFormData({
        email: "",
        password: "",
      } as UserRegister);
      
    } catch (err: any) {
      console.error("Error occurred:", err); 
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="login-button" onClick={handleSubmit}>Login</button>
      </form>
    </div>
  );
}
