const util = require("../util");

module.exports = {
    name: "skip",
    aliases: ["skipto", "ugorj"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const skipTo = args[0] ? parseInt(args[0], 10) : null;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length))
            return msg.channel.send(util.embed().setDescription("❌ | Invalid number to skip."));

        try {
            await music.skip(skipTo);
            msg.react(":ok_hand:").catch(e => e);
        } catch (e) {
            msg.channel.send(`Hiba történt: ${e.message}.`);
        }
    }
};
