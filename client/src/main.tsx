import "./utils/promise-utils.ts"

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import "./css/tailwind.dist.scss"
import "./css/index.scss"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
