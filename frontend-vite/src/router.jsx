import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import QuienesSomos from './pages/QuienesSomos'
import Calendario from './pages/Calendario'
import Noticias from './pages/Noticias'
import NoticiaDetalle from './pages/NoticiaDetalle'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
      { path: 'calendario', element: <Calendario /> },
      { path: 'noticias', element: <Noticias /> },
      { path: 'noticias/:slug', element: <NoticiaDetalle /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
