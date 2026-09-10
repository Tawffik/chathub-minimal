import { createRoot } from 'react-dom/client'
import './i18n'
import SidePanelPage from './pages/SidePanelPage'
import './base.scss'
import './sidepanel.css'

/** Side panel always shows chat UI — premium is unlocked in this build. */
function SidePanelApp() {
  return <SidePanelPage />
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<SidePanelApp />)
