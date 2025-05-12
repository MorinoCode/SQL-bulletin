import React from "react";
import "./ChannelItem.css";

export default function ChannelItem({ channel, onDelete, onView }) {
  const createdAt = new Date(channel.created_at).toLocaleString(); // om du har ett datumfält

  return (
    <div className="channel-item">
      <h3>{channel.channelname}</h3>
      <p>Skapad: {createdAt || "Okänt datum"}</p>
      <div className="channel-buttons">
        <button onClick={onView}>Gå till kanalen</button>
        <button onClick={onDelete} className="danger">Ta bort kanalen</button>
      </div>
    </div>
  );
}
