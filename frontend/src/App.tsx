import "./styles/layout.css"
import { Menu } from './components/Menu'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { BrowserRouter } from 'react-router'
import { AppRouter } from './pages/routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <main className="app-layout">
        <div className="app-header">
          <Header />
        </div>
        <div className="app-menu">
          <Menu />
        </div>
        <div className="app-content">
          <AppRouter />
        </div>
        <div className="app-footer">
          <Footer />
        </div>
      </main>
    </BrowserRouter>
  )
}

export default App
