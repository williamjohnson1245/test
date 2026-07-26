ГОТОВЫЙ REDIRECT ДЛЯ RENDER

Что делает:
- Любой запрос к сервису отправляет серверный HTTP-редирект на один фиксированный HTTPS-адрес.
- Адрес нельзя подменить параметром в URL.
- /health возвращает 200 OK и используется Render для проверки сервиса.

БЫСТРЫЙ ДЕПЛОЙ

1. Распакуй архив.
2. Создай новый пустой репозиторий GitHub.
3. Загрузи в корень репозитория:
   - server.js
   - package.json
   - render.yaml
4. В Render нажми New → Web Service.
5. Подключи репозиторий.
6. Настройки:
   Build Command: npm install
   Start Command: npm start
7. В разделе Environment добавь:
   TARGET_URL = https://твой-сайт.com/нужная-страница
   REDIRECT_STATUS = 302
8. Нажми Deploy.

КОДЫ РЕДИРЕКТА
- 302 — временный, лучший вариант для тестов.
- 301 — постоянный, браузеры могут надолго закэшировать.
- 307 — временный с сохранением HTTP-метода.
- 308 — постоянный с сохранением HTTP-метода.

ПРОВЕРКА

Открой:
https://имя-сервиса.onrender.com

Для проверки статуса:
https://имя-сервиса.onrender.com/health

ЛОКАЛЬНЫЙ ЗАПУСК

Windows PowerShell:
$env:TARGET_URL="https://example.com"
$env:REDIRECT_STATUS="302"
npm start

Важно: TARGET_URL должен начинаться с https://
