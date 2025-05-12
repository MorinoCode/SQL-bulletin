import './MessageItem.css'

export default function MessageItem({ message }) {


   const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/messages/delete-message/${message.message_id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Kunde inte ta bort meddelandet.");
        return;
      }

     
    } catch (err) {
      console.error("Nätverksfel:", err);
      alert("Nätverksfel – kunde inte ta bort meddelandet.");
    }
  };


  return (
    <div className="message-item">
      <p className="message-user">Namn : {message.username}</p>
      <p className="message-text">{message.message}</p>
       <button onClick={handleDelete} className="delete-btn">Ta bort</button>
    </div>
  );
}
