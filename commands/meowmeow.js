const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports={
    data: new SlashCommandBuilder()
        .setName('meow')
        .setDescription('meow :3'),
    async execute(interaction){
        return interaction.reply('Kitty says meow :3')
    }
}