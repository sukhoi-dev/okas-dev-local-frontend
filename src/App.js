import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme/theme';
import AppRouter from './routes/index';
import useAuthStore from './features/auth/authStore';
import useInactivityTimer from './features/auth/useInactivityTimer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { logout, isAuthenticated } = useAuthStore();

  useInactivityTimer({
    timeoutMs: 30 * 60 * 1000,
    enabled: isAuthenticated,
    onTimeout: () => {
      logout();
      window.location.href = '/auth/login';
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
