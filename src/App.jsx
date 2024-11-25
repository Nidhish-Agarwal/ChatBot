import { useState , useEffect} from 'react'
import styles from './App.module.css'
import NavigationPanel from './components/NavigationPanel'
import ChatSpace from './components/ChatSpace'

function App() {
  const [count, setCount] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 786);
  const [responses, setResponses] = useState(JSON.parse(localStorage.getItem('responses') || '[]'))

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])

  return (

    <div className={styles.cover_main_container}>
      <div className={styles.main_container}>
        {!isMobile && <NavigationPanel responses = {responses} setResponses = {setResponses} />}
        
        <ChatSpace responses = {responses} setResponses = {setResponses}/>


      </div>
    </div>
    
  )
}

export default App
