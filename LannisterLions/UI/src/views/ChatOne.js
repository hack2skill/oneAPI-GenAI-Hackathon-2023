import React, { useState, useEffect, useRef } from 'react';
import { Widget, addResponseMessage, setQuickButtons, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const buttons = [
  { label: 'Hello', value: 'Hello' },
  { label: 'How are you', value: 'How are you' }
];

function ChatOne() {
  const [message, setMessage] = useState('jd');
  const chatRef = useRef(null);

  useEffect(() => {
    const isChatOpen = localStorage.getItem('chatIsOpen') === 'true';

    if (chatRef.current && !isChatOpen) {
      chatRef.current.click();
      localStorage.setItem('chatIsOpen', 'true');
    }

    addResponseMessage('Ask questions to know more about this case');
    setQuickButtons(buttons);

    const handleVisibilityChange = () => {
      if (chatRef.current && !document.hidden) {
        chatRef.current.click();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleNewUserMessage = (newMessage) => {
  
    

  };

  const handleQuickButtonClicked = (data) => {
    console.log(data);
    addUserMessage(data);
    addResponseMessage(data + 'jd');
    setMessage(data.label);
  };

  return (
    <div className="maps-container">
      <div className="left-pane">
        <div className="loreum-text">
          <p>
          
          </p>
        </div>
      </div>
      <div className="right-pane">
        <Widget
          ref={chatRef}
          handleNewUserMessage={handleNewUserMessage}
          handleQuickButtonClicked={handleQuickButtonClicked}
          title="NEW INDIA ASSURANCE CO. LTD. Versus VINISH JAIN AND ORS"
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

export default ChatOne;
