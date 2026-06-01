import React from 'react';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import WelcomePage from './pages/WelcomePage';
import ProjectsPage from './pages/ProjectsPage';
import AddProjectPage from './pages/AddProjectPage';
import AdminPage from './pages/AdminPage';

function getPage() {
  const path = window.location.pathname;
  if (path === '/callback')     return 'callback';
  if (path === '/welcome')      return 'welcome';
  if (path === '/projects')     return 'projects';
  if (path === '/projects/new') return 'add-project';
  if (path === '/admin')        return 'admin';
  return 'login';
}

function App() {
  const page = getPage();
  if (page === 'callback')    return <CallbackPage />;
  if (page === 'welcome')     return <WelcomePage />;
  if (page === 'projects')    return <ProjectsPage />;
  if (page === 'add-project') return <AddProjectPage />;
  if (page === 'admin')       return <AdminPage />;
  return <LoginPage />;
}

export default App;
