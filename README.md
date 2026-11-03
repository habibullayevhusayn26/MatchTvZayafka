# Telegram kanal qo'shilish so'rovlarini avtomatik tasdiqlash

Bot `/start` buyrug'ini yuborgan foydalanuvchiga salomlashuv va sozlash bo'yicha ko'rsatma yuboradi, kanalga kelgan har bir qo'shilish so'rovini esa avtomatik tasdiqlaydi.

## Sozlash va ishga tushirish

1. Telegram'da [@BotFather](https://t.me/BotFather) orqali bot yarating va token oling.
2. Tokenni loyiha ildizidagi `.env` faylga quyidagicha kiriting:

   ```env
   BOT_TOKEN=BotFather_bergan_token
   ```

3. Botni kanalga administrator qilib qo'shing va unga **Invite Users / Add Subscribers** huquqini bering. Kanal uchun qo'shilish so'rovlari yoqilgan bo'lishi kerak.
4. Node.js 18 yoki yangiroq versiyasida loyiha papkasidan quyidagilarni bajaring:

   ```sh
   npm install
   npm start
   ```

Bot odatiy terminalda polling rejimida ishlaydi. Render `RENDER_EXTERNAL_URL` ni berganda, bot avtomatik webhook rejimiga o'tadi va `PORT` da HTTP server ochadi. Render Web Service uchun **Build Command** `npm ci`, **Start Command** `npm start` bo'lsin; `/health` sog'liq tekshiruvi uchun ishlaydi.

Render'ning bepul Web Service rejimi harakatsizlikda uxlab qolishi mumkin. Shu vaqtda kelgan webhook qayta uyg'otishni talab qilishi sababli so'rovlar kechikishi mumkin. Uzluksiz va kechikishsiz ishlash uchun doimiy ishlaydigan hosting kerak.
