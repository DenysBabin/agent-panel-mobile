# Agent Panel Mobile

## О проекте

Персональное мобильное приложение-панель для быстрого выполнения различных сценариев: отправка команд на сервер, голосовые сообщения и др. Часть сценариев связана с Telegram-ботом LearnerLang_bot (изучение языков), но приложение не ограничено этим — может расширяться под любые задачи.

Приложение используется одним человеком на одном устройстве. Это не продукт для публикации в App Store.

## Целевое устройство

- **Только iOS, только iPhone 11**
- Не нужна поддержка Android, iPad, других iPhone
- iOS 18.6+ (текущая версия на устройстве)
- Xcode 15.1 (на Mac)

## Стек

- React Native 0.76.9 (bare, без Expo)
- TypeScript 5.0.4
- Без навигации (одноэкранное приложение)
- Без стейт-менеджера (только useState)
- `react-native-audio-recorder-player@3.6.12` — запись аудио (deprecated, но работает; замена `react-native-nitro-sound` требует RN 0.81+)

## Структура проекта

```
App.tsx                              — главный экран: сетка кнопок + аудиозапись
config.local.ts                      — API_URL, AUDIO_URL, API_TOKEN (в .gitignore)
config.example.ts                    — шаблон конфига
src/
  components/AudioRecorderButton.tsx — UI записи: кнопка-микрофон и панель управления
  hooks/useAudioRecorder.ts          — стейт-машина записи (idle/recording/paused/sending)
  utils/permissions.ts               — запрос разрешения на микрофон
```

## Бэкенд

- Сервер: **denbabinis.website**, Python (FastAPI)
- `POST /message` — отправка текстовых команд (JSON: `{message: "..."}`)
- `POST /voice` — отправка голосовых сообщений (multipart/form-data, поле `audio`, файл .m4a)
- Авторизация: `Authorization: Bearer {API_TOKEN}`

## Сборка и запуск

### Debug (с Metro, для разработки)
```bash
# Телефон подключён по USB, Mac и телефон в одной Wi-Fi сети
npx react-native run-ios --device "iPhone Denba" --mode Debug
# Metro запустится автоматически, или:
npx react-native start
```

### Release (автономная, без Metro)
```bash
npx react-native run-ios --device "iPhone Denba"
# По умолчанию собирает Release
```

После `pod install` или добавления нативных зависимостей — обязательно пересобрать через `run-ios`.

## Конфигурация

Скопировать `config.example.ts` → `config.local.ts` и заполнить значения. Файл `config.local.ts` не коммитится.

## Соглашения

- **Язык UI**: все тексты пользователю на русском (кнопки, Alert, ошибки)
- **Язык кода**: переменные, типы, компоненты — на английском
- **Стиль**: Prettier 2.8.8, ESLint с конфигом @react-native
- **Проверка типов**: `npx tsc --noEmit`
- **Линтинг**: `npx eslint .`

## Важные особенности

- `config.local.ts` содержит секреты — никогда не коммитить
- iOS Simulator не поддерживает микрофон — тестировать запись только на физическом устройстве
- При добавлении нативных зависимостей: `npm install <pkg>` → `cd ios && pod install` → пересборка
- Если pod install падает с ошибкой module map — очистить DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/AgentPanel-*` → `cd ios && pod deintegrate && pod install`
