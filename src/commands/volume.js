const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol", "hangero", "hangerő"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = parseInt(args[0], 10);
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));
        try {
            if (isNaN(newVolume)) {
                msg.channel.send(util.embed().setDescription(`🔉 | Jelenlegi hangerő \`${music.volume}\`.`));
            } else {
                if (!msg.member.voice.channel)
                    return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                    return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

                if (newVolume < 0 || newVolume > 150)
                    return msg.channel.send(util.embed().setDescription("❌ | Kérlek adj meg egy értéket 0 és 150 között!"));

                await music.setVolume(newVolume);
                msg.channel.send(util.embed().setDescription(`🔉 | Hangerő beállítva \`${music.volume}\`.`));
            }
        } catch (e) {
            msg.channel.send(`Hiba történt: ${e.message}.`);
        }
    }
};
