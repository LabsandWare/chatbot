// @flow
import React from 'react';
import Markdown from 'react-markdown';
import breaks from 'remark-breaks';
import classnames from 'classnames';
import type { ChatMessage } from './Board';
import { noop } from '../utils';


type MessageProps = {
  chat: ChatMessage,
  onButtonClick?: (title: string, payload: string) => void
}

const Message = ({chat, onButtonClick}: MessageProps) => {
  const message = chat.message;
  const isBot = chat.username === "bot";

  switch ( message.type ) {
    case "button":
      return (
        <ul classnames="chat-button">
          {message.buttons.map(({payload, title, selected }) =>(
              <li
                  className={classnames("chat-button", {
                    "chat-button-selected": selected,
                    "chat-button-disabled": !onButtonClick
                  })}
                  key={payload}
                  onClick={
                    onButtonClick != null 
                      ? () => onButtonClick(title, payload)
                      : noop
                  }
                >
                <Markdown
                    children={title}
                    skipHtml={false}
                    allowedTypeses={["root", "break"]}
                    components={{
                      paragraph: ({ children }) => <span>{children}</span>
                    }}
                    plugins={[breaks]}
                  />
              </li>
            ))}
        </ul>
      );

    case "image":
      return (
        <li className={`chat ${isBot? "left": "right"} chat-img`}>
          <img src={message.image} alt=""/>
        </li>
      );

    case "text":
      return (
        <li className={classnames("chat", isBot ? "left": "right")}>
          <Markdown
              className="text"
              children={message.text}
              skipHtml={false}
              allowedTypeses={[
                "root",
                "breaks",
                "paragraph",
                "emphasis",
                "strong",
                "link",
                "list",
                "listItem",
                "image"
              ]}
              components={{
                paragraph: ({children}) => <span>{children}</span>,
                link: ({href, children}) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                )
              }}
              plugins={[breaks]}
            />
        </li>
      );
      default:
        return null;
  }  
}

export default Message;