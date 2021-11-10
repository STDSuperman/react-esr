import About from '../pages/about'
import { RouteConfig } from 'react-router-config'
import App from '../App'

export const routes: RouteConfig[] = [
  {
    component: App as any,
    path: '/',
    exact: true
  },
  {
    component: About as any,
    path: '/about'
  }
];