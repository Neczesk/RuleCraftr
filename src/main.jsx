import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { Button } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackbarProvider
      action={(snackbarId) => (
        <Button color="inherit" onClick={() => closeSnackbar(snackbarId)}>
          Dismiss
        </Button>
      )}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
