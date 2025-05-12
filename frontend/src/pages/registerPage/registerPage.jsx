import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [err, setErr] = useState(""); 
  const [success, setSuccess] = useState(""); 
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/users/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        
        setErr(data.message || "Ett fel uppstod");
        return;
      }

      console.log("Användare skapad:", data);
      setErr(""); // töm tidigare fel
      setSuccess(data.name)

      setTimeout(() => {
        navigate('/login')
      }, 2000);
      
    } catch (err) {
      console.error("Register error:", err);
      setErr("Ett nätverksfel uppstod.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="register">
        <form className="register_form" onSubmit={handleSubmit}>
          <h2>Skapa konto</h2>

          <label>
            Användarnamn
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Lösenord
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {err && <p className="error">{err}</p>}
          {success && <p className="success">{success} 's konto skapade</p>}

          <button type="submit">Skapa konto</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
