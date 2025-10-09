import './App.css'
import { AppProvider } from "./context/AppContext";
import { WindowProvider } from "./context/WindowContext";
import { AuthProvider } from "./context/AuthContext";
import PageRouter from "./components/pageRouter/pageRouter";
import { RootProvider } from './context/RootContext';
import Toast from './components/toast/toast';

function App() {
  return (
    <RootProvider>
      <WindowProvider>
        <AppProvider>
          <AuthProvider>
            <div className="flex min-h-screen w-full">
              <PageRouter />
            </div >
            <Toast />
          </AuthProvider>
        </AppProvider>
      </WindowProvider>
    </RootProvider >
  )
}

export default App