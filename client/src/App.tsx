import './App.css'
import { AppProvider } from "./context/AppContext";
import { WindowProvider } from "./context/WindowContext";
import { AuthProvider } from "./context/AuthContext";
import PageRouter from "./pages/pageRouter/pageRouter";
import { RootProvider } from './context/RootContext';
import Toast from './components/toast/toast';
import { FileProvider } from './context/FileContext';

function App() {
  return (
    <RootProvider>
      <WindowProvider>
        <AppProvider>
          <AuthProvider>
            <FileProvider>
              <div className="flex min-h-screen w-full">
                <PageRouter />
              </div >
              <Toast />
            </FileProvider>
          </AuthProvider>
        </AppProvider>
      </WindowProvider>
    </RootProvider >
  )
}

export default App