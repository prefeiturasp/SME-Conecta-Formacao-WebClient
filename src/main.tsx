import ReactDOM from 'react-dom/client';
import App from './App';
import { initClarity } from './clarityService';

if (import.meta.env.PROD) {
  // Inicializa o Microsoft Clarity apenas em produção
  initClarity();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
