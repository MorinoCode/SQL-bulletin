import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./CreateChannelPage.css";

export default function CreateChannelPage() {

  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
  const { userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:8000/channels/${userId}/create-channel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: channelName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ett fel uppstod vid skapande av kanal.");
        return;
      }

      setSuccess(`Kanal "${data.createdChannel.name}" har skapats.`);
      setChannelName("");
    } catch (err) {
      console.error("Nätverksfel:", err);
      setError("Nätverksfel – kunde inte kontakta servern.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="create-channel">
        <form className="create-channel-form" onSubmit={handleSubmit}>
          <h2>Skapa ny kanal</h2>

          <label>
            Kanalnamn
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Skapa kanal</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
