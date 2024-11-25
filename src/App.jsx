import { useState } from 'react'
import styles from './App.module.css'
import NavigationPanel from './components/NavigationPanel'
import ChatSpace from './components/ChatSpace'

function App() {
  const [count, setCount] = useState(0)

  return (

    <div className={styles.cover_main_container}>
      <div className={styles.main_container}>
        <NavigationPanel />
        <ChatSpace />


      </div>
    </div>
    
  )
}

export default App
