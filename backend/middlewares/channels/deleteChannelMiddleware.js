import db from '../../configs/db.js'

// Middleware för att ta bort en kanal med transaktion
const deleteChannelMiddleware = async (req, res, next) => {
  const { channelId } = req.params

  // Kontrollera att channelId finns
  if (!channelId) {
    return res.status(400).json({ message: 'channelId krävs för att ta bort kanalen' })
  }

  const client = await db.getClient() // Hämta en databas-anslutning (client)

  try {
    await client.query("BEGIN") // Starta transaktionen

    // Försök att ta bort kanalen
    const result = await client.query(
      "DELETE FROM channels WHERE id = $1 RETURNING *",
      [channelId]
    )

    if (result.rows.length === 0) {
      await client.query("ROLLBACK") // Ångra ändringarna om kanalen inte fanns
      return res.status(404).json({ message: 'Kanalen hittades inte' })
    }

    await client.query("COMMIT") // Bekräfta borttagningen

    res.status(200).json({ message: 'Kanalen borttagen', channel: result.rows[0] })
  } catch (err) {
    await client.query("ROLLBACK") // Ångra allt vid fel
    next(err)
  } finally {
    client.release() // Släpp kopplingen tillbaka till poolen
  }
}

export default deleteChannelMiddleware
