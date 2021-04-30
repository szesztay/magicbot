const util = require("../util");

module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | Először csatlakoznod kell egy hangcsatornához."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | A parancs használatához ebben a hangcsatornában kell ledded: ${msg.guild.me.voice.channel}.`));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(util.embed().setDescription(`❌ | Nincsenek megfelelő jogosultságok.`));

        if (!music.node || !music.node.connected)
            return msg.channel.send(util.embed().setDescription("❌ | Szerver hiba."));

        const query = args.join(" ");
        if (!query) return msg.channel.send(util.embed().setDescription("❌ | Hiányzó paraméterek. Tudj meg többet:  `.help` "));

        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("❌ | Couldn't find any results."));

            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(util.embed().setDescription(`✅ | \**${tracks.length}\** zene hozzáadva a következőből:  **${name}**.`));
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
                if (music.player && music.player.playing)
                    msg.channel.send(util.embed().setDescription(`✅ | **${track.info.title}** hozzáadva a listához.`));
            }

            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`Hiba történt: ${e.message}.`);
        }

        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages(
                    m => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),
                    {
                        time: 20000,
                        max: 1,
                        errors: ["time"]
                    }
                );
                return collector;
              } catch {
                return null;
            }
        }
    }
};
