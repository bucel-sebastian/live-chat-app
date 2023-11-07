import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        username: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      // La dezactivarea componentei, eliminăm ascultătorul pentru evenimentul "receive_message".
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket]);

  useEffect(() => {
    console.log(messageList);
  }, [messageList]);

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat room - {room}</h3>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
          {
            return (
              <div
                className={`${
                  messageContent.username === username
                    ? "right-message"
                    : "left-message"
                } message-box`}
              >
                <span className="message-author">
                  {messageContent.username}
                </span>
                <div className="message-text-container">
                  <p className="message-text">{messageContent.message}</p>
                  <span className="message-time">{messageContent.time}</span>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Message.."
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if (currentMessage !== "") event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#10148;</button>
      </div>
    </div>
  );
}

export default Chat;
