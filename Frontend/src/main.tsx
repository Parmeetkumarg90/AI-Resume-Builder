import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import 'antd/dist/reset.css'; // Ant Design CSS first
import './index.css';         // Tailwind CSS second
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
