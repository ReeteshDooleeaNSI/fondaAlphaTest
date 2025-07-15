import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path='index.html' element={<Navigate to='/' />} />
        <Route path='/' element={<App />} />
        <Route path='*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
