import React, { useState, useEffect, useRef } from 'react';
import { Widget, addResponseMessage, setQuickButtons, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const buttons = [
  { label: 'Hello', value: 'Hello' },
  { label: 'How are you', value: 'How are you' }
];

function Chat() {
  const [message, setMessage] = useState('jd');
  const chatRef = useRef(null);

  useEffect(() => {
    const isChatOpen = localStorage.getItem('chatIsOpen') === 'true';

    if (chatRef.current && !isChatOpen) {
      chatRef.current.click();
      localStorage.setItem('chatIsOpen', 'true');
    }

    addResponseMessage('Welcome to the legal discussion. Feel free to ask questions.');
    setQuickButtons(buttons);

    const handleVisibilityChange = () => {
      if (chatRef.current && !document.hidden) {
        // Open the chat when the page becomes visible
        chatRef.current.click();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    if(newMessage=="what is the minimum qualifications required to become a lawyer"){
      setTimeout(()=>{
         
         addResponseMessage("")
      },4000)
  }
}

  const handleQuickButtonClicked = (data) => {
    console.log(data);
    addUserMessage(data);
    addResponseMessage(data + 'jd');
    setMessage(data.label);
  };

  return (
    <div className="maps-container" style={{height:"90vh"}}>
      <div style={{width:"100%"}}>
        <Widget
          ref={chatRef}
          handleNewUserMessage={handleNewUserMessage}
          handleQuickButtonClicked={handleQuickButtonClicked}
          title="Case Whisper"
          subtitle=""
          senderPlaceHolder={`Type your message here...`}
          addUserMessage={{ defaultValue: message }}
          autofocus={true}
          emojis={true}
          showCloseButton={true}
        />
      </div>
    </div>
  );
}

export default Chat;
