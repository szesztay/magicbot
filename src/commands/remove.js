const util = require("../util");

module.exports = {
    name: "remove",
    aliases: ["rm", "eltávolít", "eltavolit", "eltavolitas", "eltávolítás"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌|  Éppen nem játszik semmit."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | A lista üres."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | A parancs használatához ebben a hangcsatornában kell ledded: ${msg.guild.me.voice.channel}.`));

        if (!args[0]) return msg.channel.send(util.embed().setDescription("❌ | Missing args."));

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return msg.channel.send(util.embed().setDescription("❌ | Invalid number to remove."));

        const removed = music.queue.splice(--iToRemove, 1)[0];
        msg.channel.send(util.embed().setDescription(`✅ | Removed **${removed.info.title}** from the queue.`));
    }
};
