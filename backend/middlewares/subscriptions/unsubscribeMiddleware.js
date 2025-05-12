import db from '../../configs/db.js';

import unsubscriptionValidator from '../../validator/subscriptionValidator.js'; // Glöm inte att importera

// Middleware för att ta bort en prenumeration
const unsubscribeMiddleware = async (req, res, next) => {
  const { user_id } = req.body;
  const { channel_id } = req.params;

  // Kontrollera att både channel_id och user_id finns
  if (!channel_id || !user_id) {
    return res
      .status(400)
      .json({ message: "Kanalens ID och användarens ID är obligatoriska." });
  }

  try {
    // Validera att detta är en giltig prenumeration att ta bort
    const isUnsubscriptionValid = await unsubscriptionValidator({ channel_id, user_id });
    if (isUnsubscriptionValid !== true) {
      return res.status(400).json(isUnsubscriptionValid);
    }

    // Försök att ta bort prenumerationen baserat på både channel_id och user_id
    const result = await db.query(
      "DELETE FROM subscriptions WHERE channel_id = $1 AND user_id = $2 RETURNING *",
      [channel_id, user_id]
    );

    // Om ingen prenumeration hittades att ta bort
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prenumerationen hittades inte." });
    }

    // Prenumeration borttagen
    res.status(200).json({ message: "Prenumerationen har tagits bort.", prenumeration: result.rows[0] });
  } catch (err) {
    // Skicka vidare till global felhantering
    next(err);
  }
};

export default unsubscribeMiddleware;
