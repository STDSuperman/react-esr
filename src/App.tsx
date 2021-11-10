import { useState, useContext, createContext } from 'react'
import { useHistory } from "react-router-dom";
import './App.css'
import logo from './logo.svg'

interface IProps {
  children: any;
}

let getInitialData = {}

// @ts-ignore
if (!import.meta.env.SSR) {
    getInitialData = window.__INITIAL_STATE__;
}

export const rootContext = createContext(Object.assign({}, getInitialData ?? {}));

function App(props: IProps) {
  const [count, setCount] = useState(0)
  const globalValue = useContext(rootContext);
  const history = useHistory();

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Hello Vite + React!</p>
          <button onClick={() => history.push('/about')}>to about page</button>
          <p>
            <button type="button" onClick={() => {
              setCount((count) => count + 1)
            }}>
              count is: {count}
            </button>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </header>
        {props.children}
      </div>
  )
}

export default App
