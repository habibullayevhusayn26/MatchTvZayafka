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

Bot ishlayotgan paytda yangi so'rovlar avtomatik tasdiqlanadi. Botni doimiy ishlatish uchun uni uzluksiz ishlaydigan serverda ishga tushiring.
