# OKAS Cloud Frontend

This project is built with Vite and React. It was originally scaffolded with Create React App boilerplate text, but the current setup has been updated to reflect Vite usage and `.jsx` source files.

## What changed from the original CRA README

- Bootstrapped with Vite instead of Create React App.
- Development server runs at `http://localhost:5173` instead of `http://localhost:3000`.
- Production build output goes to `dist/` instead of `build/`.
- Entry point is `src/index.jsx` and `index.html` now loads `/src/index.jsx`.
- React component sources use the `.jsx` extension.
- `vite.config.js` is configured to process JSX in `*.js`, `*.jsx`, `*.ts`, and `*.tsx` files.
- There is no `npm run eject` workflow in this Vite setup.

## Available Scripts

In the project directory, you can run:

### `npm install`

Install dependencies.

### `npm start`

Runs the app in development mode using Vite.
Open [http://localhost:5173](http://localhost:5173) to view it.

The page reloads automatically when you make changes.

### `npm run build`

Builds the app for production into the `dist/` folder.
The output is optimized and ready to deploy.

### `npm run preview`

Locally preview the production build.

## Project Notes

- Main application entry file: `src/index.jsx`
- Main app component: `src/App.jsx`
- Other component files now use `.jsx`
- Vite configuration: `vite.config.js`
- No CRA `eject` command is available

## Learn Mor

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
