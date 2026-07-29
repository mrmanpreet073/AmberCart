import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { persistor, store } from './Redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById('root')).render(
  // console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
          <Toaster duration={4000} position="bottom-right" richColors />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
