import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { store } from './redux/store';
import CreatePage from './pages/CreatePage';
import PreviewPage from './pages/PreviewPage';
import MyFormsPage from './pages/MyFormsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dynamic Form Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/create"
            variant={isActive('/create') ? 'outlined' : 'text'}
          >
            Create
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/preview"
            variant={isActive('/preview') ? 'outlined' : 'text'}
          >
            Preview
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/myforms"
            variant={isActive('/myforms') ? 'outlined' : 'text'}
          >
            My Forms
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const AppContent: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;