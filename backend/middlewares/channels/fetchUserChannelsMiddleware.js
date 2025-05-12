import db from '../../configs/db.js'

// Middleware för att hämta alla kanaler
const fetchUserChannelsMiddleware = async (req, res, next) => {

    const { user_id } = req.params;
  try {
    // Hämta alla kanaler från databasen
   const result = await db.query(
      `SELECT channels.id,channels.created_at, channels.name AS channelName, users.name AS userName
       FROM channels
       JOIN users ON channels.user_id = users.id
       WHERE channels.user_id = $1`,
      [user_id]
    );
    // Om inga kanaler finns, returnera ett 404 fel
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Inga kanaler finns" })
    }

    // Skicka tillbaka alla kanaler som JSON
    res.status(200).json(result.rows)
    console.log(result.rows);
    
  } catch (err) {
    // Vid fel, skicka vidare till global felhantering
    next(err)
  }
}

export default fetchUserChannelsMiddleware
