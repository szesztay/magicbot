const util = require("../util");

module.exports = {
    name: "shuffle",
    aliases: ["sf"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | A lista üres."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        music.queue = util.shuffleArray(music.queue);

        msg.channel.send(util.embed().setDescription(`✅ | Queue shuffled! Type \`${msg.client.prefix}queue\` to see changes.`));
    }
};
