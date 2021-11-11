import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { routes } from './router'
import { renderRoutes } from 'react-router-config'
import { renderMode, RenderModeEnum } from '../global.config'

ReactDom[renderMode === RenderModeEnum.ESR ? 'hydrate' : 'render'](
    <BrowserRouter>
        {renderRoutes(routes)}
    </BrowserRouter>,
    document.getElementById('root')
)