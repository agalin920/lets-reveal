import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components'
import preset from '@rebass/preset';
import './index.css';
import App from './App';

const theme = {
  ...preset,
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
