import ThemeContextProvider
from "./context/ThemeContext";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import {AuthProvider} from "./context/AuthProvider";
import { SearchProvider } from "./providers/SearchProvider";
createRoot(document.getElementById('root')!).render(
<ThemeContextProvider>
    <AuthProvider>
    <SearchProvider>
    <App />
    </SearchProvider>
    </AuthProvider>
</ThemeContextProvider>)
