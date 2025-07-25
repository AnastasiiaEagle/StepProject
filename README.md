# StepProject
ChatGPT сказал:
Окей! Ось технічне завдання (ТЗ) для проєкту "Premium CatFacts" — навчального застосунку для вивчення Stripe (одноразові платежі, підписки, продаж товарів).

🐱 Технічне Завдання: "Premium CatFacts"
🎯 Мета:
Створити навчальний вебзастосунок, який дозволяє:

Придбати набір цифрового контенту (одноразовий платіж)

Оформити щомісячну підписку

Купити окремі продукти (цифрові "товари")

Навчитися обробляти Stripe Checkout, Subscriptions, Webhooks

⚙️ Технології:
Компонент	Технологія
Фронтенд	Next.js (App Router, CSR + SSR)
Бекенд	NestJS (REST API)
Система платежів	Stripe (Checkout, Webhooks, Subscriptions)
UI	TailwindCSS або ShadCN UI
Сховище (опц.)	PostgreSQL (через Prisma) або in-memory
Аутентифікація	NextAuth.js (опційно)

📑 Основні розділи сайту:
1. Головна сторінка /
Опис проекту (фановий стиль)

Кнопки:

Купити "CatFacts Premium PDF"

Оформити "Cat Lover Subscription"

Переглянути "Магазин мемів"

2. Магазин /shop
Список цифрових товарів

Кнопка “Купити” → перенаправляє на Stripe Checkout

Приклади товарів:
Назва	Ціна	Тип
"Cat Memes Access"	$5	Одноразова
"Cat Sticker Pack"	$3	Одноразова
"CatFacts Premium PDF"	$7	Одноразова
"Cat Lover Subscription"	$4.99/міс	Підписка

3. Кабінет користувача /account
Перевірка статусу підписки (через Stripe API)

Посилання на Stripe Customer Portal

Список куплених товарів (локально або через вебхуки)

🔄 Платіжна логіка:
Stripe Checkout:
Фронт викликає API /api/create-checkout-session

API створює сесію в Stripe → повертає URL → редирект

Webhooks:
/webhook обробляє:

checkout.session.completed

invoice.paid

customer.subscription.created

Відповідно оновлює статус оплати / підписки

📦 База даних (опціонально):
Таблиця	Поля
Users	id, email, stripeCustomerId
Orders	id, userId, productId, paymentStatus, sessionId
Products	id, name, stripePriceId, type (one_time / sub)
Subscriptions	id, userId, status, currentPeriodEnd

✅ Мінімальний функціонал MVP:
Завдання	Опис
✅ Створення Checkout Session	В NestJS: API для створення Stripe-сесії
✅ Оплата товару	Stripe Checkout, редирект
✅ Підписка	Окрема кнопка підписки через Stripe
✅ Webhooks	Обробка подій (інформування та оновлення в базі)
✅ Кабінет користувача	Статус підписки + список замовлень
✅ Магазин товарів	Каталог із кнопками “Купити”

🧠 Додаткове (після MVP):
Купони / промокоди

Збереження карток для майбутніх покупок

Email сповіщення

Stripe Elements замість Checkout (для кастомного UI)

Аутентифікація з NextAuth або Clerk