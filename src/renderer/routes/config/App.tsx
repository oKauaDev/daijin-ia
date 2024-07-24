import React from 'react'
import './App.css'
import ApplicationPage from './routes/ApplicationPage'
import ShortcutPage from './routes/ShortcutPage'
import IAPage from './routes/IAPage'
import useGlovalVariables from '../../src/stores/GlovalVariables'
import { ConfigInterface } from '../../../main/utils/Config'

function App() {
  const glovalVariables = useGlovalVariables()
  const [route, setRoute] = React.useState<'application' | 'shortcuts' | 'ai'>('application')
  const [render, setRender] = React.useState(false)

  React.useEffect(() => {
    async function define() {
      //@ts-ignore
      const confis: ConfigInterface = await window.api.getConfig()
      setRender(true)
      glovalVariables.setConfig(confis)
    }

    define()
  }, [])

  return (
    <section className="container">
      <div className="navbar">
        <button
          className={`nav-button ${route === 'application' ? 'active' : ''}`}
          onClick={() => setRoute('application')}
        >
          Aplicação
        </button>
        {/* <button
          className={`nav-button ${route === "shortcuts" ? "active" : ""}`}
          onClick={() => setRoute("shortcuts")}
        >
          Atalhos
        </button> */}
        <button
          className={`nav-button ${route === 'ai' ? 'active' : ''}`}
          onClick={() => setRoute('ai')}
        >
          IA
        </button>
      </div>
      {render && (
        <div>
          {route === 'application' && <ApplicationPage />}
          {route === 'shortcuts' && <ShortcutPage />}
          {route === 'ai' && <IAPage />}
        </div>
      )}
    </section>
  )
}

export default App
