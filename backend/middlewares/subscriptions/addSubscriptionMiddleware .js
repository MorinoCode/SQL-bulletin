import db from '../../configs/db.js';
import subscriptionValidator from '../../validator/subscriptionValidator.js';

const addSubscriptionMiddleware = async (req, res, next) => {
  const { user_id } = req.body;
  const { channel_id } = req.params;

  try {
    // Kontrollera att både channel_id och user_id finns
    if (!channel_id || !user_id) {
      return res
        .status(400)
        .json({ message: "Kanalens ID och användarens ID är obligatoriska." });
    }

    // Validera prenumerationen med extern validator
    const isSubscriptionValid = await subscriptionValidator({ channel_id, user_id });
    if (isSubscriptionValid !== true) {
      return res.status(400).json(isSubscriptionValid);
    }

    // Kontrollera att användaren finns i databasen
    const isUserExist = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );
    if (isUserExist.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Detta användar-ID finns inte i databasen." });
    }

    // Kontrollera att kanalen finns i databasen
    const isChannelExist = await db.query(
      "SELECT id FROM channels WHERE id = $1",
      [channel_id]
    );
    if (isChannelExist.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Detta kanal-ID finns inte i databasen." });
    }

    // Skapa den nya prenumerationen
    const newSubscription = await db.query(
      "INSERT INTO subscriptions (channel_id, user_id) VALUES ($1, $2) RETURNING *",
      [channel_id, user_id]
    );

    // Skicka svar med den nya prenumerationen
    return res
      .status(201)
      .json({ message: "Ny prenumeration skapades.", subscription: newSubscription.rows[0] });
  } catch (err) {
    // Vid fel, skicka vidare till global felhantering
    next(err);
  }
};

export default addSubscriptionMiddleware;
