// Important Variables
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, PartialWebhookMixin } = require('discord.js');
const { token } = require('./config.json');
const {MessageEmbed} = require("discord.js")

// Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS], partials: ["MESSAGE", "REACTION"] });

// Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Message Events
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(`Kitty draw!`, {type: "WATCHING"})
});

client.on('messageCreate', (message) => {
	if (message.content == "hi"){
		message.reply("omg hi big fan")
	}
})

client.on('messageCreate', (message) => {
	if (message.author.bot) return

	if (message.content == "meow"){
		message.reply("meow meow")
	}
})

client.on('messageCreate', (message) => {
	if (message.content == "hru"){
		message.reply("im good, if u were asking someone else im sorry")
	}
})

welcomeChannel = "981590854340866048"

client.on('guildMemberAdd', (member) => {
	member.guild.channels.cache.get(welcomeChannel).send(`<@${member.id}>`)
})

// Interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'The fucking command died ping duke', ephemeral: true });
	}
});

// DisTube Event

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))



// Login
client.login(token);
