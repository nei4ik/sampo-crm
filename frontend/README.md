# CRM — Business Trainer (React + TypeScript + Vite)

## 🇷🇺 Русский язык

### Описание проекта
Это CRM-система для управления клиентами, построенная на стеке **React 19**, **TypeScript** и **Vite**. Проект использует **Prisma ORM v6** с SQLite для персистентности данных. Авторизация реализована через **Argon2** (хеширование паролей) и **JWT-токены**.

### 📁 Структура проекта
```
frontend/
├── src/
│   ├── components/          # Header, Footer, Menu
│   ├── features/            # ClientsList
│   ├── lib/                 # Auth конфигурация
│   ├── pages/
│   │   ├── ClientsPage.tsx  # Форма добавления + список клиентов
│   │   ├── LoginPage.tsx    # Страница входа
│   │   └── RegisterPage.tsx # Регистрация пользователя
│   ├── routes/              # AppRouter (защита маршрутов)
│   ├── styles/              # tokens.css, base.css, layout.css, components/*
│   ├── App.tsx              # Точка входа + BrowserRouter
│   └── main.tsx             # Рендер приложения
├── package.json             # Зависимости
└── vite.config.ts           # Прокси на backend: /api → localhost:3001
```
Схема БД и сервер API находятся в каталоге `backend/`.

### 🛠 Технологии
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `react` | ^19.2.8 | UI-фреймворк |
| `react-router` | ^8.4.0 | Роутинг (BrowserRouter, Link, Navigate) |
| `typescript` | ~6.0.2 | Статическая типизация |
| `vite` | ^8.3.0 | Бандлер + HMR |
| `tailwindcss` | ^4.3.3 | Стилизация (семантические токены) |
| `@prisma/client` | ^6.19.3 | ORM для работы с БД |

### 🔐 Авторизация
- **Регистрация**: `POST /api/auth/register` → `{username, password}`
- **Вход**: `POST /api/auth/login` → `{token, username}` (JWT 24 ч)
- **Хеширование**: Argon2 (одностороннее, с солью)
- **Защита маршрутов**: `/asiakkaat` требует валидный токен
- Для создания тестового пользователя командой `npm run db:init` задайте `ADMIN_PASSWORD` (не менее 8 символов) в окружении backend. Пароль не записывается в логи.

### 📡 API (Backend: http://localhost:3001)
| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/customers` | Список клиентов (защита JWT) |
| `POST` | `/api/customers` | Создать клиента |
| `PUT` | `/api/customers/:id` | Обновить клиента |
| `DELETE` | `/api/customers/:id` | Удалить клиента |
| `POST` | `/api/auth/register` | Регистрация пользователя |
| `POST` | `/api/auth/login` | Вход и получение токена |

В интерфейсе сейчас доступны просмотр и добавление клиентов. Редактирование и удаление доступны через API, но пока не реализованы в интерфейсе.

### 🚀 Запуск
```bash
# Backend (терминал 1)
cd CRM/backend
npm run dev          # http://localhost:3001

# Frontend (терминал 2)
cd CRM/frontend
npm run dev          # http://localhost:5173
```

### 📦 Сборка для продакшена
```bash
npm run build        # создаёт dist/
npm run preview      # локальный сервер для проверки сборки
```

---

## 🇫🇮 Suomi

### Projektin kuvaus
Tämä on asiakasrekisterijärjestelmä (CRM), joka on rakennettu **React 19**, **TypeScript** ja **Vite** -teknologioilla. Projektissa käytetään **Prisma ORM v6**:ta SQLite-tietokannan kanssa datan pysyvän säilyttämiseen. Kirjautuminen toteutetaan **Argon2**-hashauksella (salasanojen turvaava hashaus) ja **JWT-tokeneilla**.

### 📁 Projektin rakenne
```
frontend/
├── src/
│   ├── components/          # Header, Footer, Menu
│   ├── features/            # ClientsList
│   ├── lib/                 # Auth konfigurointi
│   ├── pages/
│   │   ├── ClientsPage.tsx  # Asiakkien lisääminen + lista
│   │   ├── LoginPage.tsx    # Kirjautumissivu
│   │   └── RegisterPage.tsx # Käyttäjän rekisteröinti
│   ├── routes/              # AppRouter (reittien suojelu)
│   ├── styles/              # tokens.css, base.css, layout.css, components/*
│   ├── App.tsx              # Entry point + BrowserRouter
│   └── main.tsx             # Sovelluksen renderöinti
├── package.json             # Riippuvuudet
└── vite.config.ts           # Proxy backendille: /api → localhost:3001
```
Tietokannan skeema ja API-palvelin sijaitsevat `backend/`-hakemistossa.

### 🛠 Teknologiat
| Paketti | Versio | Käyttötarkoitus |
|---------|--------|-----------------|
| `react` | ^19.2.8 | UI-kehys |
| `react-router` | ^8.4.0 | Reittaus (BrowserRouter, Link, Navigate) |
| `typescript` | ~6.0.2 | Tyypitys |
| `vite` | ^8.3.0 | Bundler + HMR |
| `tailwindcss` | ^4.3.3 | Tyylit (semanttiset tokenit) |
| `@prisma/client` | ^6.19.3 | Tietokantatyön ORM |

### 🔐 Kirjautuminen
- **Rekisteröinti**: `POST /api/auth/register` → `{username, password}`
- **Kirjautuminen**: `POST /api/auth/login` → `{token, username}` (JWT 24 h)
- **Hashaus**: Argon2 (yksisuuntainen, suolattu)
- **Reittien suojaus**: `/asiakkaat` vaatii voimassa olevan tokenin
- Aseta backendin ympäristömuuttuja `ADMIN_PASSWORD` (vähintään 8 merkkiä) ennen `npm run db:init` -komennon suorittamista. Salasanaa ei tulosteta lokiin.

### 📡 API (Backend: http://localhost:3001)
| Verbi | Polku | Kuvaus |
|-------|-------|--------|
| `GET` | `/api/customers` | Asiakkien lista (JWT-suojaus) |
| `POST` | `/api/customers` | Uuden asiakkaan luominen |
| `PUT` | `/api/customers/:id` | Asiakkaan päivittäminen |
| `DELETE` | `/api/customers/:id` | Asiakkaan poistaminen |
| `POST` | `/api/auth/register` | Käyttäjän rekisteröinti |
| `POST` | `/api/auth/login` | Kirjautuminen ja tokenin saanti |

Käyttöliittymässä voi tällä hetkellä tarkastella ja lisätä asiakkaita. Muokkaus ja poistaminen ovat saatavilla API:ssa, mutta niitä ei vielä ole käyttöliittymässä.

### 🚀 Käynnistäminen
```bash
# Backend (terminaali 1)
cd CRM/backend
npm run dev          # http://localhost:3001

# Frontend (terminaali 2)
cd CRM/frontend
npm run dev          # http://localhost:5173
```

### 📦 Tuotantokokoaminen
```bash
npm run build        # luo dist/-hakemiston
npm run preview      # tuotannon testaus paikallisella palvelimella
```

---

## 📝 Huomautuksia (Notes)

- **SQLite** käytetään kevyenä tietokantana kehityksessä. Tuotannossa voit vaihtaa PostgreSQLiin tai MySQL:ään muokkaamalla `prisma/schema.prisma`.
- **JWT-tokenit** tallennetaan `localStorage`:hen. Muista poistaa tokenit tuotannossa (esim. `httpOnly`-cookieiden kautta).
- **Argon2** on suositeltu salasanojen hashausmenetelmä (bcrypt vaihtoehto).
