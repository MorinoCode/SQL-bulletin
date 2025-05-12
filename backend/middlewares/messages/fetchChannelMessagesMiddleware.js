import db from "../../configs/db.js";

const fetchChannelMessagesMiddleware = async (req, res, next) => {
  const { channelId } = req.params;

  try {
    const result = await db.query(
      `
  SELECT 
    m.id AS message_id,
    m.content AS message,
    u.name AS username,
    c.name AS channelname
  FROM messages m
  JOIN users u ON m.user_id = u.id
  JOIN message_channels mc ON m.id = mc.message_id
  JOIN channels c ON mc.channel_id = c.id
  WHERE c.id = $1
  ORDER BY m.created_at ASC
`,
      [channelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Inga meddelanden hittades" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

export default fetchChannelMessagesMiddleware;
