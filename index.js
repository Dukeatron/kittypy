// Important Variables
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, PartialWebhookMixin } = require('discord.js');
const { token } = require('./config.json');
const {ReactionRole} = require('discordjs-reaction-role')

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

// Login
client.login(token);
