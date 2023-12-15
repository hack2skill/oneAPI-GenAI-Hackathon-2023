import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import {useLocation} from 'react-router-dom'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function ChatOne() {
  const [typing, setTyping] = useState(false);
  const location = useLocation();
  const [disabled,setDisabled]=useState(false);

  useEffect(()=>{
    console.log(location.state.Summary)
  },[])
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Case Whisper, Please ask anything related to this case",
      sender: "ChatGPT",
    },
  ]);

  const hdlSend = async (msg) => {
    setDisabled(true);
    const newMsg = {
      message: msg,
      sender: "user",
      direction: "outgoing",
    };
    const newMsgs = [...messages, newMsg];
    setMessages(newMsgs);
    setTyping(true);
    await sendToChatGPT(newMsgs);
  };

  const sendToChatGPT = async (chatMsgs) => {
    const apiMsgs = chatMsgs.map((msgObj) => {
      const role = msgObj.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: msgObj.message };
    });
    console.log(chatMsgs[chatMsgs.length - 1]);
      const data=await axios.post('http://localhost:5000/chat',{query:chatMsgs[chatMsgs.length - 1].message,context:location.state.state.context,init:true});
      console.log(data);
      let data2=""
      if(data.data.response==="thread started"){
        console.log("in if")
          while(1){
            

          data2=await axios.post('http://localhost:5000/chat',{query:chatMsgs[chatMsgs.length - 1].message,context:location.state.state.context,init:false});
          if(data2.data.response.endsWith("{##eoa##}")){
            setMessages([...chatMsgs, { message: data2.data.response.slice(0,-9).replace("<|/ASSISTANT|>", ""), sender: "ChatGPT" }]);
            break;
          }
          setMessages([...chatMsgs, { message: data2.data.response, sender: "ChatGPT" }]);
          if(data2.data.response!==""){
            setTyping(false);
          }
          }
      }
      setDisabled(false);
     
  };

  return (
    <div className="maps-container" style={{ display: 'flex' }}>
      <div className="left-pane" style={{ flex: '30%' }}>
        <div className="loreum-text">
          <p>
            {location.state.state.Summary}
          </p>
        </div>
      </div>
      <div className="right-pane" style={{ flex: '70%' }}>
        <div
          style={{
            height: "90vh", 
            display: "flex",
            flexFlow: "column",
            backgroundColor: "#f4f4f4",
          }}
        >
          <MainContainer
            style={{
              width: "100%", 
              flexBasis: "90%",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <ChatContainer style={{ padding: 8 }}>
              <MessageList
                style={{ padding: 8 }}
                typingIndicator={
                  typing ? (
                    <TypingIndicator
                      style={{ margin: 4, opacity: 0.5 }}
                      content="Case Whisper is typing"
                    />
                  ) : null
                }
              >
                {messages.map((msg, i) => (
                  <Message key={i} model={msg} style={{ marginBlock: 8 }} />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type your message here"
                onSend={hdlSend}
                sendButtonProps={{ content: "Send" }}
                disabled={disabled}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}

export default ChatOne;
