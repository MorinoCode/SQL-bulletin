
import express from 'express'

import fetchChannelsMiddleware from '../../middlewares/channels/fetchChannelsMiddleware.js'
import fetchUserChannelsMiddleware from '../../middlewares/channels/fetchUserChannelsMiddleware.js'
import createChannelMiddleware from '../../middlewares/channels/createChannelMiddleware.js'
import deleteChannelMiddleware from '../../middlewares/channels/deleteChannelMiddleware.js'

const router = express.Router()

// Hämta alla kanaler
router.get('/' , fetchChannelsMiddleware)

// Hämta alla kanaler som tillhör en specefik användare
router.get('/:user_id/your-channels' , fetchUserChannelsMiddleware)

// skapa en ny kanal
router.post('/:user_id/create-channel' , createChannelMiddleware)

//delete en channel
router.delete('/:channelId' , deleteChannelMiddleware)



export default router