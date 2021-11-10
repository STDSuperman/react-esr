import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { routes } from './router'
import { renderRoutes } from 'react-router-config'

ReactDom.hydrate(
    <BrowserRouter>
        {renderRoutes(routes)}
    </BrowserRouter>,
    document.getElementById('root')
)