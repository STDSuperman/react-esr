import { useState, useContext, createContext } from 'react'
import { useHistory } from "react-router-dom";
import Demo from './components/demo'
import './App.css'

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
        <Demo></Demo>
        {props.children}
      </div>
  )
}

export default App
