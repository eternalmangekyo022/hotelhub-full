import { useState } from "react";
import axios from "axios";
import "./styles/register.scss";

export default function Register() {
  const [formData, setFormData] = useState<UserRegister>({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
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
      const response = await axios.post("http://localhost:3000/api/v1/register", formData, { headers: { 'Content-Type': 'application/json' } });
      console.log("Response received:", response.data);
  
      setSuccess("User registered successfully");
      setError("");
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
      } as UserRegister);
      
    } catch (err: any) {
      console.error("Error occurred:", err); 
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
  };
  

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="register-form">
  <input
    type="text"
    name="firstname"
    placeholder="First Name"
    value={formData.firstname}
    onChange={handleChange}
    className="register-input"
    required
  />
  <input
    type="text"
    name="lastname"
    placeholder="Last Name"
    value={formData.lastname}
    onChange={handleChange}
    className="register-input"
    required
  />
  <input
    type="text"
    name="phone"
    placeholder="Phone"
    value={formData.phone}
    onChange={handleChange}
    className="register-input"
    required
  />
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    className="register-input"
    required
  />
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    className="register-input"
    required
  />
  <button 
    type="submit" 
    className="register-button" 
    onClick={handleSubmit}>
    Register
  </button>
</form>

    </div>
  );
}
