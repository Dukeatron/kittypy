const {CommandInteraction, MessageEmbed, VoiceChannel} = require("discord.js");
const { VideoQualityModes } = require("discord.js/typings/enums");

module.exports = {
  name: "music",
  description: "complete music system",
  permissions: "ADMINISTRATOR",
  options: [
    {
      name: "play",
      description: "play a track",
      type: "SUB_COMMAND",
      options: [{name: "query", description: "provide name or link for song :D", type: "STRING", required: true}]
    },
    {
      name: "volume",
      description: "change volume",
      type: "SUB_COMMAND",
      options: [{name: "percent", description: "10 = 10%", type: "NUMBER", required: true}]
    },
    {
      name: "settings",
      description: "select an option",
      type: "SUB_COMMAND",
      options: [{name: "options", description: "select an option", type: "STRING", required: true,
      choices: [
        {name: "queue", value: "queue"},
        {name: "skip", value: "skip"},
        {name: "pause", value: "pause"},
        {name: "resume", value: "resume"},
        {name: "stop", value: "stop"},
      ]}]
    }
  ],
  /**
   * 
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * 
   */
  async execute(interaction, client){
    const {options, member, guild, channel} = interaction;
    const voiceChannel = member.voice.channel

    if (!VoiceChannel)
    return interaction.reply({content: "you need to be in a voice channel to use that cmd lol", ephemeral: true})

    if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
    return interaction.reply({content: `already connected to <#${guild.me.voice.channelId}>`, ephemeral: true})

    try {
      switch(options.getSubcommand()){
        case "play": {
          client.distube.playVoiceChannel(VoiceChannel, options.getString("query", { textChannel: channel, member: member }));
          return interaction.reply({content: "request received"})
        }
        case "volume": {
          const Volume = options.getNumber("percent")
          if(Volume > 100 || Volume < 1)
          return interaction.reply({content: "specify a number between 1 and 100 lol"})

          client.distube.setVolume(VoiceChannel, Volume)
          return interaction.reply({content: `volume's been set to ${Volume}%`})
        }
        case "settings": {
          const queue = await client.distube.getQueue(VoiceChannel);

          if (!queue)
          return interaction.reply({content: "theres no queue wtf u doing"})

          switch(options.getString("options")){
            case "skip":
              await queue.skip(VoiceChannel)
              return interaction.reply({content: "song skipped"})

              case "stop":
                await queue.stop(VoiceChannel)
                return interaction.reply({content: "music stopped"})
              
              case "pause":
                await queue.pause(VoiceChannel)
                return interaction.reply({content: "music paused"})

                case "resume":
                await queue.resume(VoiceChannel)
                return interaction.reply({content: "music resumed"})

                case "queue":
                  return interaction.reply({embeds: [new MessageEmbed()]
                  .setColor("GREEN")
                  .setDescription(`${queue.songs.map(
                    (song, id) => `\n**${id + 1}**. ${song.name} - \``
                  )}`)
                  })

              
          }
        }

      }









    } catch (e) {
      const errorEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`ALERT: ${e}`)
      return interaction.reply({embed: [errorEmbed]})
    }
  }
}