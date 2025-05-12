import React, { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, setUser } = useContext(MyContext) || {};

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Ett fel uppstod");
        return;
      }

      setUser({
          name: data.name,
          password: data.password,
          token: data.token,
          userId: data.userId,
        });
      setErr(""); // töm tidigare fel
      setSuccess(`Välkommen, ${data.name}!`);

      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      console.error("Login error:", err);
      setErr("Ett nätverksfel uppstod.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="login">
        <form className="login_form" onSubmit={handleSubmit}>
          <h2>Logga in</h2>

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
          {success && <p className="success">{success}</p>}

          <button type="submit">Logga in</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
