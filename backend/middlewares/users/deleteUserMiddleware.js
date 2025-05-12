import db from '../../configs/db.js'

// Middleware för att ta bort en användare
const deleteUserMiddleware = async (req, res, next) => {
    const { userId } = req.params

    // Kontrollera att userId är skickat i params
    if (!userId) {
        return res.status(400).json({ message: 'UserId krävs för att ta bort användaren' })
    }

    try {
        // Försök att ta bort användaren med det specifika id:t
        const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId])

        // Om ingen användare raderades, svara med ett 404 fel
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Användaren hittades inte' })
        }

        // Om användaren togs bort, skicka ett bekräftelsemeddelande
        res.status(200).json({ message: 'Användaren borttagen', user: result.rows[0] })
    } catch (err) {
        // Vid fel, skicka vidare till global felhantering
        next(err)
    }
}

export default deleteUserMiddleware
