import db from "../../configs/db.js";


const createMessageMiddleware = async (req, res, next) => {
  const { user_id, content, channel_ids } = req.body;

  if (!user_id || !content || !Array.isArray(channel_ids) || channel_ids.length === 0) {
    return res.status(400).json({ message: "user_id, content och minst en channel_id krävs." });
  }

  const client = await db.getClient(); // 🔑 Få en manuell databas-klient

  try {
    await client.query("BEGIN"); // 🔁 Starta transaktion

    // 📨 1. Skapa meddelande
    const result = await client.query(
      "INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, content]
    );
    const message = result.rows[0];

    // 🔗 2. Koppla meddelandet till flera kanaler
    for (const channel_id of channel_ids) {
      await client.query(
        "INSERT INTO message_channels (message_id, channel_id, created_at) VALUES ($1, $2, NOW())",
        [message.id, channel_id]
      );
    }

    await client.query("COMMIT"); // ✅ Allt lyckades, spara till DB

    res.status(201).json({
      message: "Meddelandet skapades och kopplades till kanaler.",
      data: message,
      channels: channel_ids,
    });

  } catch (err) {
    await client.query("ROLLBACK"); // ❌ Något gick fel, ångra allt
    console.error("❌ Fel vid transaktion:", err.message);
    next(err);
  } finally {
    client.release(); // 🛑 Släpp anslutningen (obligatoriskt!)
  }
};

export default createMessageMiddleware;


// import db from "../../configs/db.js";

// const createMessageMiddleware = async (req, res, next) => {
// const { user_id, content, channel_ids } = req.body;

// // Validera indata
// if (!user_id || !content || !Array.isArray(channel_ids) || channel_ids.length === 0) {
// return res.status(400).json({ message: "user_id, content och minst en channel_id krävs." });
// }

// try {
// // 1. Skapa meddelandet
// const newMessage = await db.query(
// "INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
// [user_id, content]
// );


// const message = newMessage.rows[0];



// // 2. Koppla till flera kanaler i message_channels
// const insertMessageToChannels = channel_ids.map((channel_id) =>
//   db.query(
//     "INSERT INTO message_channels (message_id, channel_id, created_at) VALUES ($1, $2, NOW())",
//     [message.id, channel_id]
//   )
// );

// // Vänta på att alla insert-operationer ska bli klara
// await Promise.all(insertMessageToChannels);

// res.status(201).json({
//   message: "Meddelandet skapades och kopplades till kanaler.",
//   data: message,
//   channels: channel_ids,
// });


// } catch (err) {
// next(err);
// }
// };

// export default createMessageMiddleware
