import React from 'react'
import styles from './NavigationPanel.module.css'
import logo from '../assets/Logo.png'

export default function NavigationPanel(props) {

  const clearChat = () => {
    localStorage.removeItem('responses');
    props.setResponses([])

  }

  return (
    <div className={styles.main_container}>
        <div className={styles.heading}>
            <img className={styles.logo} src={logo} alt="logo" />
            <h1 className={styles.h1}>Chat Bot</h1>
        </div>
        <div className={styles.navigation_panel}>
            <div className={`${styles.navigation_option} ${styles.active_option}`}>
                {/* <img className={styles.option_logo} src={ChatBubble} alt="chat svg" /> */}
                <svg className={styles.option_logo} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6L2 22ZM5.15 16H20V4H4V17.125L5.15 16Z"/>
</svg>

                <h2 className={styles.option_h2}>Chat Generator</h2>
            </div>
        </div>

        <div className={styles.bottom_panel}>
          <button onClick={clearChat}>clear chat</button>
        </div>
    </div>
  )
}

