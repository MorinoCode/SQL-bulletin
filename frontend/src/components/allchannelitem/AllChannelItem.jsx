import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllChannelItem.css";
import { MyContext } from "../../App";

export default function AllChannelItem({ channel }) {
  const { user } = useContext(MyContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  // Hämta prenumerationer för användaren vid sidladdning
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch("http://localhost:8000/subscriptions", {
          method: "GET",
        });
        const result = await response.json();
        
        // Kontrollera om användaren redan är prenumererad på kanalen
        const subscribedChannel = result.find(
          (sub) => sub.channelname === channel.channelname && sub.username === user.name
        );

        if (subscribedChannel) {
          setIsSubscribed(true); // Om prenumererad, sätt isSubscribed till true
        }
      } catch (err) {
        console.error("Fel vid hämtning av prenumerationer:", err);
      }
    };

    if (user) {
      checkSubscription();
    }
  }, [user, channel.channelname]);

  const handleView = () => {
    navigate(`/allChannels/channel/${channel.id}`);
  };

  const handlePrenumerera = async () => {
    try {
      const response = await fetch(`http://localhost:8000/subscriptions/subscribe/${channel.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: String(user.userId) }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Fel vid prenumeration:", result.message);
        return;
      }

      setIsSubscribed(true); // Uppdatera UI när användaren prenumererar
    } catch (err) {
      console.error("Nätverksfel:", err);
    }
  };

  const handleAvprenumerera = async () => {
    try {
      const response = await fetch(`http://localhost:8000/subscriptions/unsubscribe/${channel.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: String(user.userId) }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Fel vid avprenumeration:", result.message);
        return;
      }

      console.log("Avprenumeration lyckades:", result);
      setIsSubscribed(false); // Uppdatera UI när användaren avprenumererar
    } catch (err) {
      console.error("Nätverksfel:", err);
    }
  };

  return (
    <div className="channel-item">
      <h3>{channel.channelname}</h3>
      <p>Skapad av: {channel.username}</p>
      <div className="channel-buttons">
        <button className="view-btn" onClick={handleView}>Gå till kanalen</button>
        <button 
          className="pre-btn"  
          onClick={isSubscribed ? handleAvprenumerera : handlePrenumerera}
        >
          {isSubscribed ? "Avprenumerera" : "Prenumerera"}
        </button>
      </div>
    </div>
  );
}
