import React , {useState, useEffect, useRef} from 'react';
import styles from './ChatSpace.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatBubble from './ChatBubble';

export default function ChatSpace(props) {
  const responses = props.responses;
  const setResponses = props.setResponses;

  const [userInput, setUserInput] = useState('');

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const chatAreaRef = useRef();

  useEffect(() => {
    // Check if SpeechRecognition API is supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Keep listening until stopped
      recognitionInstance.interimResults = true; // Get interim results while the user speaks
      recognitionInstance.lang = 'en-US'; // Set language for recognition

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Loop through all recognition results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        // Update the transcript state
        setUserInput(finalTranscript + interimTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.log('SpeechRecognition is not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);


  const toggleListening = () => {
    if (isListening) {

      recognition.stop();
    } else {

      recognition.start();
    }
    setIsListening(!isListening);
  };

  useEffect(()=>{

    scrollToBottom();
    localStorage.setItem('responses', JSON.stringify(responses));

  },[responses])

  
  async function textGenTextOnlyPrompt() {
    setResponses((prevResponses) => [...prevResponses, ''])
    
    
    
    
    const genAI = new GoogleGenerativeAI('AIzaSyBrfXssUntW_mvrOtPuoGo8MjH4AuSSYXU');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    
    setUserInput('');
    const result = await model.generateContentStream(userInput);
    
    // Print text as it comes in.
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      setResponses((prevResponses)=>{
        const updatedResponse = prevResponses.map((content, index) => (
          index === prevResponses.length-1? content + chunkText: content
        ))


        return updatedResponse
      })
    }
    
  }
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      handleSubmit(e);
    }
  }


  const scrollToBottom = () => {
    if(chatAreaRef.current){
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }
  
  const handlechange = (e) => {
    setUserInput(e.target.value);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(userInput !== ''){
      if(isListening){
        recognition.stop();
        setIsListening(false);
      }
      setResponses(prevResponses => [...prevResponses, userInput])
      textGenTextOnlyPrompt();
      
    }
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.heading}>
        <h1 className={styles.h1}>Chat Generator</h1>
      </div>

      <div className={styles.chat_container}>
        <div ref = {chatAreaRef} className={styles.chat_area}>
          {responses.map((curr, index) => (
            <ChatBubble key = {index} type = {index%2==0? 'user':'bot'} message = {curr}/>
          ))}
        </div>
        <form action="" onSubmit={handleSubmit} className={styles.input_box}>
          <div className={styles.input_section}>
            <svg onClick={toggleListening} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 21C16.75 21 15.6875 20.5625 14.8125 19.6875C13.9375 18.8125 13.5 17.75 13.5 16.5V7.5C13.5 6.25 13.9375 5.1875 14.8125 4.3125C15.6875 3.4375 16.75 3 18 3C19.25 3 20.3125 3.4375 21.1875 4.3125C22.0625 5.1875 22.5 6.25 22.5 7.5V16.5C22.5 17.75 22.0625 18.8125 21.1875 19.6875C20.3125 20.5625 19.25 21 18 21ZM16.5 31.5V26.8875C13.9 26.5375 11.75 25.375 10.05 23.4C8.35 21.425 7.5 19.125 7.5 16.5H10.5C10.5 18.575 11.2313 20.3438 12.6938 21.8063C14.1562 23.2688 15.925 24 18 24C20.075 24 21.8438 23.2688 23.3063 21.8063C24.7688 20.3438 25.5 18.575 25.5 16.5H28.5C28.5 19.125 27.65 21.425 25.95 23.4C24.25 25.375 22.1 26.5375 19.5 26.8875V31.5H16.5Z" fill="#1D1B20"/>
            </svg>
            <textarea value={userInput} name="" id="" placeholder='Ask me Anything...' onChange={handlechange} onKeyDown={handleKeyDown}/>
          </div>
          <button type="submit" className={styles.submit_button}>
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.3334 2.66666L14.6667 17.3333M29.3334 2.66666L20 29.3333L14.6667 17.3333M29.3334 2.66666L2.66669 12L14.6667 17.3333" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

      </div>

     

    </div>
  )
} 
