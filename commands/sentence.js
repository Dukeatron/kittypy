const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('send')
      .setDescription('Make kitty send a sentence in custom channels')
      .addStringOption(option => option.setName('sentence').setDescription('put words here :3')),
  async execute(interaction){
    const sentence = interaction.options.getString('sentence');

    await interaction.reply(sentence)
  }
}
