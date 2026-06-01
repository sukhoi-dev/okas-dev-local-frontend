import React from 'react';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import WelcomePage from './pages/WelcomePage';

function getPage() {
  const path = window.location.pathname;
  if (path === '/callback') return 'callback';
  if (path === '/welcome') return 'welcome';
  return 'login';
}

function App() {
  const page = getPage();
  if (page === 'callback') return <CallbackPage />;
  if (page === 'welcome') return <WelcomePage />;
  return <LoginPage />;
}

export default App;
