import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./AllChannelsPage.css";
import AllChannelItem from "../../components/allchannelitem/AllChannelItem";

export default function AllChannelsPage() {
  
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`http://localhost:8000/channels`);
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
  }, []);

  

  return (
    <>
      <Navbar />
      <main className="your-channels">
        <h2>Alla Kanalaer</h2>
        {error && <p className="error">{error}</p>}
        <div className="channels-list">
          {channels.map((channel) => (
            <AllChannelItem
              key={channel.id}
              channel={channel}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
