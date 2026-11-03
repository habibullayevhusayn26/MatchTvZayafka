import "dotenv/config";
import { Bot } from "grammy";

const token = process.env.BOT_TOKEN?.trim();

if (!token) {
  console.error("BOT_TOKEN is missing. Add your Telegram bot token to the .env file.");
  process.exit(1);
}

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  const name = ctx.from?.first_name;
  const greeting = name ? `, ${escapeHtml(name)}` : "";

  await ctx.reply(
    `<tg-emoji emoji-id="5472055112702629499">👋</tg-emoji> Assalomu alaykum${greeting}!\n\n<tg-emoji emoji-id="5393569473041048967">✅</tg-emoji> Men kanalingizga kelgan qo'shilish so'rovlarini avtomatik tasdiqlayman.\n\n<tg-emoji emoji-id="5386766919154016047">🦾</tg-emoji> Botni kanalga administrator qilib qo'shing va so'rovlarni boshqarish huquqini bering.\n\n<tg-emoji emoji-id="5431577498364158238">📊</tg-emoji> Shundan so'ng so'rovlar avtomatik tasdiqlanadi.`,
    { parse_mode: "HTML" },
  );
});

bot.on("chat_join_request", async (ctx) => {
  const { chat, from } = ctx.chatJoinRequest;

  await ctx.api.approveChatJoinRequest(chat.id, from.id);
  console.info(`Approved a join request in chat ${chat.id}.`);
});

bot.catch((error) => {
  console.error(`Failed to handle update ${error.ctx.update.update_id}:`, error.error);
});

async function main() {
  await bot.start({
    onStart: (botInfo) => {
      console.info(`Bot @${botInfo.username} is running.`);
    },
  });
}

main().catch((error) => {
  console.error("Failed to start the bot:", error);
  process.exitCode = 1;
});

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}