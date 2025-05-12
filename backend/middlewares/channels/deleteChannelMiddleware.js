
import db from '../../configs/db.js'

// Middleware för att ta bort en channel
const deleteChannelMiddleware = async (req, res, next) => {
    const { channelId } = req.params

    // Kontrollera att channelId är skickat i params
    if (!channelId) {
        return res.status(400).json({ message: 'channelId krävs för att ta bort användaren' })
    }

    try {
        // Försök att ta bort kanal med det specifika id:t
        const result = await db.query("DELETE FROM channels WHERE id = $1 RETURNING *", [channelId])

        // Om ingen kanal raderades, svara med ett 404 fel
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Kanalen hittades inte' })
        }

        // Om kanalen togs bort, skicka ett bekräftelsemeddelande
        res.status(200).json({ message: 'kanalen borttagen', channel: result.rows[0] })
    } catch (err) {
        // Vid fel, skicka vidare till global felhantering
        next(err)
    }
}

export default deleteChannelMiddleware
