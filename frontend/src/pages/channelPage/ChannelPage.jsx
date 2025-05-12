import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import MessageItem from "../../components/messageItem/MessageItem";
import "./ChannelPage.css";

export default function ChannelPage() {
  const { userId, channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // <- Input state
  const [error, setError] = useState("");

  const fetchChannelAndMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/messages/${userId}/yourChannels/${channelId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Något gick fel vid hämtning.");
        return;
      }

      setChannel(data[0].channelname);
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError("Nätverksfel – kunde inte hämta kanalens data.");
    }
  };

  useEffect(() => {
    fetchChannelAndMessages();
  }, [channelId , messages]);

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
          user_id: userId,
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
      fetchChannelAndMessages();
    } catch (err) {
      console.error(err);
      setError("Nätverksfel – kunde inte skicka meddelandet.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="channel-page">
        {error && <p className="error">{error}</p>}
        {channel && <h2 className="channel-name">Kanal: {channel}</h2>}

        <section className="messages-list">
          {messages.map((msg) => (
            <MessageItem key={msg.message_id} message={msg} />
            
          ))}
        </section>

       
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            placeholder="Skriv ett meddelande..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="message-send-btn">Skicka</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
