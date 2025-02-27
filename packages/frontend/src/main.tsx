import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import { store } from './redux/store';
import router from './router';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={createTheme()}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
);
