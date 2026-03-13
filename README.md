# TBSP (Telegram Bot Starter Pack)

A basic template for developing Telegram bots with Node.js, designed to serve as a **starting point** for new projects.

The goal is to provide a **clear, modular, and extensible structure** that allows you to focus on the bot's logic without having to configure all the necessary infrastructure from scratch.

The project includes a code organization focused on separating responsibilities, making it easy to add handlers, services, and other components in an organized way.
This allows the bot to scale maintainably as the project grows.

In addition, the template incorporates several common tools in modern development, such as support for internationalization, integration with Turso, and a configuration ready for current Node.js environments.

## Features

- Modular architecture designed for scalability.
- Clear separation between Telegram logic and business logic.
- Support for handlers and services to organize functionalities.
- Internationalization via i18next.
- Turso-ready integration.
- Modern Node.js configuration with ESM.
- Structure designed for reuse as a foundation for multiple bots.

## Project structure

The following directories are where you will add your own code

```
src/
 ├── db/
 │   └── repositories/
 │
 ├── handlers/
 │   └── example.handlers.js
 │
 ├── services/
 │   └── example.service.js
 │
 └── i18n/
     └── locales/
```

### General description:

- `db/repositories`: Repository for database management
- `handlers`: Telegram event handlers or commands
- `services`: Reusable business logic
- `i18n/locales`: Translation files and internationalization configuration.

## Installation

1. Clone repositorie

```
git clone https://github.com/usuario/telegram-bot-starter.git
cd telegram-bot-starter
```

2. Install dependencies

```
pnpm install
```

3. Configure environment variables according to the project's needs (e.g., bot token, database, etc.). You can refer to the `.env.example` file for guidance.

4. Launch bot

```
pnpm start
```

## Creating handlers

### Basic example of a handler:

The handler code must have the following structure:

```
export default {
  name: 'hello', // Command name (without /): /hello
  execute: async (ctx) => {
    await ctx.reply('Hello world!');
  },
};

```

Once you have written the code, you must save the file in: `src/bot/handlers/NAME.handler.js`.

_The file name and the handler 'name' do not have to be the same_

## Internationalization

The project uses **i18next** to manage translations.
The language files are located in: `src/i18n/locales/`

Each language can be organized into multiple JSON files to separate different domains of the bot.
The bot automatically loads all JSON files found in the `locales/lang` directory, but we recommend keeping the base files for the default language (`en`).
If you need to add more specific files for your handlers, you'll have to create one for each available language to provide the broadest possible support.

## Database

The template includes support for Turso, allowing for easy integration of data persistence into the bot.
Configuration are managed through environment variables (see `.env.example`).

## Purpose of the Project

This repository is designed as a **reusable foundation** for creating Telegram bots without having to repeat common configurations in each new project. The idea is to provide a clean and extensible structure that can be easily adapted to different use cases.

## Requirements

Before using this project, you need the following:

- [Node.js](https://nodejs.org/) v.24 or higher (LTS recommended)
- [pnpm](https://pnpm.io/) as a dependency manager
- A Telegram bot token obtained from [Telegram BotFather](https://telegram.me/botfather)
- (Optional) A [Turso]() database if data persistence is desired
- [Render](https://render.com/) or similar

## Dependencies

The project uses several libraries to simplify bot development:

- [grammY](https://grammy.dev/)
- [@libsql/client (Turso)](https://github.com/tursodatabase/libsql)
- [express](https://expressjs.com/)
- [i18next](https://www.i18next.com/)
- [quick-lru](https://github.com/sindresorhus/quick-lru)

These dependencies are already included in the project and will be installed automatically with `pnpm install`.

## Configuration

The main project configuration is centralized in the config module (`src/config/config.js`).

It will typically include variables such as:

- Bot token
- Webhook configuration
- Database parameters
- Supported languages

It is recommended to use environment variables to manage these values.

## Contributing

Contributions are welcome. Some ways to collaborate:

- Report bugs
- Suggest architectural improvements
- Add examples of handlers or integrations
- Improve the documentation
- Share any feedback — constructive or brutally destructive.

If you'd like to contribute, open an issue or submit a pull request in the repository.

## Licenses

This project is licensed under the GNU Affero General Public License v3.0.

## Credits

This project uses third-party libraries:

- [grammY](https://github.com/grammyjs/grammY) - MIT License
- [@libsql/client](https://github.com/tursodatabase/libsql) – MIT License
- [express](https://github.com/expressjs/express) - MIT License
- [i18next](https://github.com/i18next/i18next) - MIT License
- [quick-lru](quick-lru) - MIT License

Thanks to the developers and communities that maintain these projects.
