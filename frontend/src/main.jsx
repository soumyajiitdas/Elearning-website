import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { Usercontextprovider } from './context/Usercontext.jsx'
import { Coursecontextprovider } from './context/Coursecontext.jsx'

export const server='http://localhost:5000'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Usercontextprovider>
      <Coursecontextprovider>
        <App />
      </Coursecontextprovider>
    </Usercontextprovider>
  </StrictMode>
);
