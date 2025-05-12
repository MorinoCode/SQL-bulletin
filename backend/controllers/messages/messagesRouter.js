import express from "express";

import createMessageMiddleware from "../../middlewares/messages/createMessageMiddleware.js";
import fetchMessagesMiddleware from "../../middlewares/messages/fetchMessagesMiddleware.js";
import deleteMessageMiddleware from "../../middlewares/messages/deleteMessageMiddleware.js";
import fetchUserChannelMessagesMiddleware from "../../middlewares/messages/fetchUserChannelMessagesMiddleware.js";
import fetchChannelMessagesMiddleware from "../../middlewares/messages/fetchChannelMessagesMiddleware.js";

const router = express.Router();

// Hämta alla meddelanden
router.get('/', fetchMessagesMiddleware);

// Hämta alla meddelanden som tillhör en användaren kanal
router.get('/:userId/yourChannels/:channelId', fetchUserChannelMessagesMiddleware)

//Hämta all meddelande som tillhör en visst kanal
router.get('/:channelId', fetchChannelMessagesMiddleware)

// POST /messages – skapa ett meddelande och koppla till en eller flera kanaler
router.post("/create-message", createMessageMiddleware);

//ta bort ett meddelande
router.delete("/delete-message/:message_id" , deleteMessageMiddleware)

export default router;
