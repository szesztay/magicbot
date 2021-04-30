const util = require("../util");

module.exports = {
    name: "stop",
    aliases: ["leave", "dc"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        try {
            await music.stop();
            msg.react(":octagonal_sign:").catch(e => e);
        } catch (e) {
            msg.channel.send(`Hiba történt: ${e.message}.`);
        }
    }
};
