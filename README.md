# React Assignments

A Vite and React app that brings several frontend assignments together behind a single navigation bar.

## Assignments

- **A1: Portfolio** - personal portfolio with about, education, skills, and contact sections.
- **A2: Students** - student directory.
- **A3: Employees** - employee view.
- **A4: Weather** - weather lookup using OpenWeatherMap.
- **A5: Cart** - shopping cart with coupon codes `FARM10` and `WELCOME20`.
- **A6 and A7: Tasks and Auth** - task app with a browser-simulated login flow. Any username and password can be used; authentication is not backed by a server.

## Requirements

- Node.js and npm
- An OpenWeatherMap API key for the A4 weather assignment

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Weather API setup

Copy `.env.example` to `.env` and set `VITE_OWM_KEY` to your OpenWeatherMap API key. Restart the development server after changing the file. Do not commit `.env` or put real credentials in source control.

## Production build

```sh
npm run build
```
