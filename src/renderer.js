import { injectGlobal } from 'emotion'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

injectGlobal`
html,
body {
  height: 100%;
  background-color: transparent; /* prevents white flash */
}

body {
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-app-region: drag;
  text-align: center;
  color: white;
  background-color: black;
  font-family: sans-serif;
  font-size: calc(12px + (5 + 12) * (100vw - 100px) / (400 - 100));
  font-weight: 300;
}

#root {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
`

ReactDOM.render(<App />, document.getElementById('root'))
