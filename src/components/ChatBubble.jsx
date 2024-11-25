import React, { useState } from 'react'
import styles from './ChatBubble.module.css';
import MarkdownIt from 'markdown-it';

export default function ChatBubble(props) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const toggleSpeach = () => {
        if(isSpeaking){
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }else{
            if(props.message !== ''){
                const speech = new SpeechSynthesisUtterance(props.message);
                speech.onend = () => {
                    setIsSpeaking(false);
                }
                speechSynthesis.speak(speech);
                setIsSpeaking(true);
            }
        }
    }

    const md = new MarkdownIt();


  return (
    <div className={`${styles.main_container} ${props.type=="user"? styles.user: styles.bot}`}>
      <div className={styles.chat_box}>
        <svg onClick={toggleSpeach} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.31 12.5806C24.716 13.9749 25.5059 15.8658 25.5059 17.8374C25.5059 19.809 24.716 21.6999 23.31 23.0942M16.5 7.43535L9 13.3836H3V22.306H9L16.5 28.2543V7.43535Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" stroke:inejoin="round"/>
        </svg>

        {/* <div dangerouslySetInnerHTML={{__html: md.render(props.message)}}></div> */}
        <div>{props.message}</div>

      </div>
    </div>
  )
}
