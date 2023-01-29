const token = Deno.env.get("BOT_TOKEN");
const guildId = Deno.env.get("GUILD_ID") || Deno.env.get("TEST_GUILD_ID");

if (!token) throw new Error("Bot Token missing!");
if (!guildId) throw new Error("Guild Id missing!");

const config = {
  botToken: token,
  botId: BigInt(atob(token.split(".")[0])),
  guildId: BigInt(guildId),
};

export default config;
