import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import function that starts React
// and connects it to the webpage. ee react 18 rakamundhu.. ReactDOM.render() ani rasevallam..ippudu createRoot()...

import './index.css'
import './i18n/index.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
{/*strict mode ante : like a development checker.. it helps find mistakes..like unsafe code,deprecated code etc...*/}


// .render we write to show the components on the screen