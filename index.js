import "dotenv/config";
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { Bot, webhookCallback } from "grammy";

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
    `<blockquote><tg-emoji emoji-id="5472055112702629499">👋</tg-emoji> Assalomu alaykum${greeting}!\n\n<tg-emoji emoji-id="5393569473041048967">✅</tg-emoji> Men kanalingizga kelgan qo'shilish so'rovlarini avtomatik tasdiqlayman.\n\n<tg-emoji emoji-id="5386766919154016047">🦾</tg-emoji> Botni kanalga administrator qilib qo'shing va so'rovlarni boshqarish huquqini bering.\n\n<tg-emoji emoji-id="5431577498364158238">📊</tg-emoji> Shundan so'ng so'rovlar avtomatik tasdiqlanadi.</blockquote>`,
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
  const externalUrl = process.env.RENDER_EXTERNAL_URL?.trim();

  if (externalUrl) {
    await startWebhookServer(externalUrl);
    return;
  }

  await bot.start({
    onStart: (botInfo) => {
      console.info(`Bot @${botInfo.username} is running.`);
    },
  });
}

async function startWebhookServer(externalUrl) {
  const baseUrl = new URL(externalUrl);
  if (baseUrl.protocol !== "https:") {
    throw new Error("RENDER_EXTERNAL_URL must use HTTPS.");
  }

  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  const secret = randomBytes(32).toString("hex");
  const webhookPath = `/telegram/${secret}`;
  const webhookUrl = new URL(webhookPath, baseUrl).toString();
  const handleUpdate = webhookCallback(bot, "http", { secretToken: secret });

  const server = createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, { "content-type": "text/plain" }).end("ok");
      return;
    }

    if (request.method !== "POST" || request.url !== webhookPath) {
      response.writeHead(404).end("Not found");
      return;
    }

    void handleUpdate(request, response).catch((error) => {
      console.error("Failed to process Telegram webhook update:", error);
      if (!response.headersSent) {
        response.writeHead(500).end("Internal Server Error");
      } else {
        response.destroy(error instanceof Error ? error : undefined);
      }
    });
  });

  await bot.init();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "0.0.0.0", resolve);
  });

  try {
    await bot.api.setWebhook(webhookUrl, {
      secret_token: secret,
      allowed_updates: ["message", "chat_join_request"],
    });
  } catch (error) {
    await new Promise((resolve) => server.close(resolve));
    throw error;
  }

  console.info(`Bot @${bot.botInfo.username} is listening for Telegram webhooks.`);

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      console.info(`Received ${signal}; shutting down HTTP server.`);
      server.close((error) => {
        if (error) {
          console.error("Failed to close HTTP server cleanly:", error);
          process.exitCode = 1;
        }
      });
    });
  }
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