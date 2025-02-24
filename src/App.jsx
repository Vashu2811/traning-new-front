
import { useSelector } from 'react-redux'
import './App.css'
import Consultant from './pages/LendingPage.jsx'

function App() {

  const { currentMode } = useSelector(state => state.customer)

  return (
    <>
      <Consultant />
    </>
  )
}

export default App
