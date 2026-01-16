import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme.js'
import './index.css';
import {Provider} from 'react-redux'
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
    <HelmetProvider>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </ThemeProvider>
    </HelmetProvider>
    </Provider>
  </StrictMode>,
)
