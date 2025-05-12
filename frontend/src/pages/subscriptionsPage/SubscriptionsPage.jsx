import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import './SubscriptionsPage.css'

export default function SubscriptionsPage() {
  const { user } = useContext(MyContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  const fetchSubscriptions = () => {
  fetch("http://localhost:8000/subscriptions")
    .then((res) => res.json())
    .then((data) => {
      const userSubs = data.filter((sub) => sub.username === user.name);
      setSubscriptions(userSubs);
    })
    .catch((err) => {
      console.error("Fel vid hämtning:", err);
    });
};

useEffect(() => {
  if (user) fetchSubscriptions();
}, [user]);

const handleUnsubscribe = (channelId) => {
  fetch(`http://localhost:8000/subscriptions/unsubscribe/${channelId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: String(user.userId) }),
  })
    .then((res) => {
      if (res.ok) {
        // 🔁 Hämta uppdaterad lista
        fetchSubscriptions();
      }
    })
    .catch((err) => {
      console.error("Fel vid borttagning:", err);
    });
};


  const handleGoToChannel = (channelId) => {
    navigate(`/allChannels/channel/${channelId}`);
  };

  
  return (
    <>
      <Navbar />
      <main className="subscriptions-page">
        <h1>Dina Prenumerationer</h1>

        {subscriptions.length === 0 ? (
          <p>Du prenumererar inte på några kanaler.</p>
        ) : (
          <div className="subscription-list">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="subscription-item">
                <h3>{sub.channelname}</h3>

                <button className="green" onClick={() => handleGoToChannel(sub.channel_id)}>
                  Gå till kanalen
                </button>
                <button className="red" onClick={() => handleUnsubscribe(sub.channel_id)}>
                  Avprenumerera
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
