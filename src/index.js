require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const express = require('express');
const eventHandler = require('./handlers/eventHandler');
const createLogger = require('./utils/logger');
const { logChannel } = require('../config.json');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const logger = createLogger(client);

eventHandler(client, logger);

client.login(process.env.BOT_TOKEN);

const app = express();
app.use(express.json());

app.post('/log', async (req, res) => {
  const { level, message, context } = req.body;
  try {
    console.log(level);
    if (level == "info") logger.info(null, message, context);
    else if (level == "warn") logger.warn(null, message, context);
    else if (level == "error") logger.error(null, message, context);
    else if (level == "fatal") logger.fatal(null, message, context);
    else throw new Error('Invalid log level');
    res.status(200).send('Log sent successfully');
  } catch (error) {
    console.error('Failed to send log:', error);
    res.status(500).send('Failed to send log');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Log server running on port ${PORT}`);
});

module.exports = client;