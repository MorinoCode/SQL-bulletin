import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { MyContext } from "../../App";

export default function ChannelsPage() {
  const { user } = useContext(MyContext);
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  // Hämta meddelanden när komponenten laddas
  // Lägg utanför useEffect:
const fetchMessages = async () => {
  try {
    const res = await fetch(`http://localhost:8000/messages/${channelId}`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Fel vid hämtning av meddelanden");
      return;
    }

    setMessages(data);
  } catch (err) {
    console.error(err);
    setError("Kunde inte hämta meddelanden.");
  }
};

useEffect(() => {
  fetchMessages();
}, [channelId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/messages/create-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
          content: newMessage,
          channel_ids: [channelId],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Kunde inte skicka meddelandet.");
        return;
      }

      // Töm inputfältet och uppdatera meddelanden
      setNewMessage("");
      fetchMessages();

    } catch (err) {
      console.error(err);
      setError("Nätverksfel – kunde inte skicka meddelandet.");
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/messages/delete-message/${messageId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Kunde inte ta bort meddelandet.");
        return;
      }

      // Uppdatera listan efter borttagning (valfritt sätt)
      setMessages((prev) => prev.filter((m) => m.message_id !== messageId));
    } catch (err) {
      console.error("Nätverksfel:", err);
      alert("Nätverksfel – kunde inte ta bort meddelandet.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="channel-page">
        <h2>Meddelanden i kanalen</h2>
        {error && <p className="error">{error}</p>}
        <div className="messages-list">
          {messages.map((msg, i) => (
            <div key={msg.message_id} className="message-item">
              <p>
                <strong>{msg.username}</strong>: {msg.message}
              </p>
              

              {msg.username === user.name && (
                <button
                  onClick={() => handleDelete(msg.message_id)}
                  className="delete-btn"
                >
                  Ta bort
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            placeholder="Skriv ett meddelande..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="message-send-btn">
            Skicka
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
