import { injectGlobal } from 'emotion'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { BLACK } from './config'

injectGlobal`
* {
  box-sizing: border-box;
}

html,
body {
  background-color: transparent; /* prevents white flash */
  height: 100%;
}

body {
  -webkit-app-region: drag;
  background-color: ${BLACK};
  color: white;
  font-family: sans-serif;
  font-size: calc(12px + (5 + 12) * (100vw - 100px) / (400 - 100));
  font-weight: 300;
  margin: 0;
  overflow: hidden;
  position: relative;
  text-align: center;
  user-select: none;
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
