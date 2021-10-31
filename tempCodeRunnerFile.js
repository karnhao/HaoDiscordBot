Config.getInterval().ChannelId.forEach(t => {
    client.channels.cache.get(t).send(getAbout("🤖" + client.user.username + " พร้อมแล้ว"));
});