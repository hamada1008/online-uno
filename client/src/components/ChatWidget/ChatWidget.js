import { useEffect } from "react";
import { Widget, addResponseMessage, addLinkSnippet } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
const ChatWidget = ({ socket, room }) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/gi;
  const linkRegEx = new RegExp(expression);
  useEffect(() => {
    socket &&
      socket.on("recieve-message", (message) => {
        if (message.match(linkRegEx)) {
          addLinkSnippet({ title: message, link: message, target: "_blank" });
        } else {
          addResponseMessage(message);
        }
      });
  }, []);
  const avatarUrls = {
    users:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    title:
      "https://i2.wp.com/gamingcypher.com/wp-content/uploads/2019/01/UNO-Icon-Gaming-Cypher.png?resize=300%2C300&ssl=1",
  };
  const handleNewUserMessage = (message) => {
    socket && socket.emit("send-message", room, message);
  };
  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={avatarUrls.users}
        profileClientAvatar={avatarUrls.users}
        titleAvatar={avatarUrls.title}
        title="Chat with your opponent"
        subtitle={false}
        emojis={true}
      />
    </div>
  );
};

export default ChatWidget;
