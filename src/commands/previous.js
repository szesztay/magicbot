const util = require("../util");

module.exports = {
    name: "previous",
    aliases: ["prev", "pr", "előző", "elozo"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));
        if (!music.previous) return msg.channel.send(util.embed().setDescription("❌ | Nincsenek ezt megelőző zenék."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | A parancs használatához ebben a hangcsatornában kell ledded: ${msg.guild.me.voice.channel}.`));

        try {
            music.queue.unshift(music.previous);
            await music.skip();
            msg.react("⏮️").catch(e => e);
        } catch (e) {
            msg.channel.send(`Hiba történt: ${e.message}.`);
        }
    }
};
