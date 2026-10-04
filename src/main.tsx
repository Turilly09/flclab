import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { DiagnosticErrorBoundary } from './components/DiagnosticErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <DiagnosticErrorBoundary name="Aplicación Principal FLC LAB">
    <App />
  </DiagnosticErrorBoundary>
);
