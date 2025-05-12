import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ChannelItem from "../../components/channelItem/ChannelItem";
import "./YourChannelsPage.css";

export default function YourChannelsPage() {
  const { userId } = useParams();
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`http://localhost:8000/channels/${userId}/your-channels`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Något gick fel");
          return;
        }

        setChannels(data);
      } catch (err) {
        setError("Kunde inte hämta kanaler.");
        console.error(err);
      }
    };

    fetchChannels();
  }, [userId]);

  const handleDelete = async (channelId) => {
    try {
      const res = await fetch(`http://localhost:8000/channels/${channelId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setChannels(channels.filter(c => c.id !== channelId));
      } else {
        const data = await res.json();
        alert(data.message || "Kunde inte ta bort kanalen");
      }
    } catch (err) {
      alert("Nätverksfel vid borttagning.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <main className="your-channels">
        <h2>Dina Kanaler</h2>
        {error && <p className="error">{error}</p>}
        <div className="channels-list">
          {channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              onDelete={() => handleDelete(channel.id)}
              onView={() => navigate(`/${userId}/yourChannels/${channel.id}`)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
