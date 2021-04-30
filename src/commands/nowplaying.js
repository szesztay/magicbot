const util = require("../util");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "nowplay"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Éppen nem játszik semmit."));
        const progress = util.progress(music.player.state.position, music.current.info.length);
        msg.channel.send(util.embed().setDescription(`🎶 | Ezt játsza: ${music.current.info.isStream ? "[**◉ ÉLŐ**]" : ""}\n**${music.current.info.title}**.${music.current.info.isStream ? "" : `\n\n${util.millisToDuration(music.player.state.position)} ${progress.bar} ${util.millisToDuration(music.current.info.length)}`}`));
    }
};
