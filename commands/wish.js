const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('wish')
      .setDescription('Wish kitty a happy birthday!'),
  async execute(interaction){
    return interaction.reply(`You wished kitty a happy birthday :tada:`)
  },
}
