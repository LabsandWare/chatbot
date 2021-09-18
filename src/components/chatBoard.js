/* @flow */
import React, { Component, Fragment } from 'react';
import isEqual from 'lodash.isequal';

// import css
import './message.css';

import Message from "./message";


const REDRAW_INTERVAL = 10000;
// const GROUP_INTERVAL = 60000;

export type MessageType = 
  | {
      type: "text",
      text: string
    }
  | { type: "image", image: string }
  | {
      type: "button",
      buttons: Array<{ payload: string, title: string, selected?: boolean }>
    }
  | {
      type: "custom",
      content: any
    };

export type ChatMessage = {
  message: MessageType,
  username: string,
  uuid: string
};

const WaitingBubble = () => (
  <li className="chat waiting">
    <span>●</span> <span>●</span> <span>●</span>
  </li>
);

const MessageGroup = ({ messages, onButtonClick }) => {

  return (
    <Fragment>
      { messages.map((message, i) => (
          <Message
            chat={message}
            key={i}
            onButtonClick={ onButtonClick }
            />
      ))}

    </Fragment>
  );
};

type BoardProps = {
  messages: Array<ChatMessage>,
  isOpen: boolean,
  waitingForBotResponse: boolean,
  onButtonClick: (message: string, payload: string) => *,
  onSendMessage: (message: string) => *,
  onToggleChat: () => *
}

type BoardState = {
  inputValue: string
}

class Board extends Component<BoardProps, BoardState> {
  
  state = {
    inputValue: ""
  };

  lastRendered: number = 0;
  chatsRef = React.createRef<HTMLDivElement>();
  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate(prevProps: BoardProps) {
    if (!isEqual(prevProps.messages, this.props.messages)) {
      this.scrollToBot();
    }
    if (!prevProps.isOpen && this.props.isOpen) {
      this.focusInput();
    }
    this.lastRendered = Date.now();
  }

  shouldComponentUpdate(nextProps: BoardProps, nextState: BoardState) {
    return (
      !isEqual(nextProps, this.props) ||
      !isEqual(nextState, this.state) ||
      Date.now() > this.lastRendered + REDRAW_INTERVAL
    );
  }

  getInputRef(): HTMLInputElement {
    const { inputRef } = this;
    if (inputRef.current == null) throw new TypeError("inputRef is null.");
    return ((inputRef.current: any): HTMLInputElement);
  }

  getChatsRef(): HTMLElement {
    const { chatsRef } = this;
    if (chatsRef.current == null) throw new TypeError("inputRef is null.");
    return ((chatsRef.current: any): HTMLElement);
  }

  scrollToBot() {
    this.getChatsRef().scrollTop = this.getChatsRef().scrollHeight;
  }

  focusInput(){
    this.getInputRef().focus();
  }

  handleSubmitMessage = async (e?: SyntheticEvent<>) => {
    if (e != null) {
      e.preventDefault();
    }
    const message = this.getInputRef().value.trim();
    this.props.onSendMessage(message);
    this.setState({inputValue: ""})
  }

  handleButtonClick = (message: string, payload: string) => {
    if (this.props.onButtonClick != null) {
      this.props.onButtonClick(message, payload);
    }
    this.focusInput();
  }

  groupMessages(messages: Array<ChatMessage>) {
    if (messages.length === 0 ) return [];

    let currentGroup = [messages[0]];
    let lastUsername = messages[0].username;
    let lastType = messages[0].message.type;
    const groups = [currentGroup];

    for (const message of messages.slice(1)) {
      if (
          // Buttons always have their own group
          lastType === "button" ||
          message.message.type === "button" ||
          // Messages are grouped by user/bot
          message.username !== lastUsername
        ) {
          // new group
          currentGroup = [message];
          groups.push(currentGroup);
        } else {
          // append to group
          currentGroup.push(messages);
        }
        lastUsername = message.username;
        lastType = message.message.type;
    }
    return groups;
  }

  handleInputChange = async (
    inputValue: string,
    scrollToEnd: boolean = false
  ) => {
    await this.setState({
      inputValue
    });
    if(scrollToEnd) {
      const inputRef = this.getInputRef();
      inputRef.focus();
      inputRef.scrollToLeft = inputRef.scrollWidth;
    }
  };

  render() {

    const { messages, waitingForBotResponse } = this.props;
    const messageGroups = this.groupMessages(messages);
    const isClickable = i =>
      !waitingForBotResponse && i === messageGroups.length - 1;

    const renderInputForm = () => {
      if (!waitingForBotResponse) {
        return (
          <input className="input" 
            type="text" 
            value={this.state.inputValue}
            onChange={event =>
              this.handleInputChange(event.currentTarget.value)
            }
            ref={this.inputRef}
            placeholder="Type your message..." />);
      } else {
        return null;
      }
    }

    return(
        <>
          <div className="hero-body">
            <div className="messages-window">
              <div className="chats pr-4" ref={this.chatsRef}>
                { messageGroups.map((group, i) => (
                    <MessageGroup
                        messages={group}
                        key={i}
                        onButtonClick={
                          isClickable(i)? this.handleButtonClick : undefined
                        }
                      />
                  ))}
                {waitingForBotResponse ? <WaitingBubble /> : null}
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <form onSubmit={this.handleSubmitMessage}>
              <div className="field has-addons">
                <div className="control is-expanded">
                  {renderInputForm()}
                </div>
                <div className="control">
                  <button className="button">
                    <svg height="36px" width="36px" viewBox="0 0 36 36"><g fill="none" fillRule="evenodd"><g><polygon points="0 36 36 36 36 0 0 0"></polygon><path d="M31.1059281,19.4468693 L10.3449666,29.8224462 C8.94594087,30.5217547 7.49043432,29.0215929 8.17420251,27.6529892 C8.17420251,27.6529892 10.7473302,22.456697 11.4550902,21.0955966 C12.1628503,19.7344961 12.9730756,19.4988922 20.4970248,18.5264632 C20.7754304,18.4904474 21.0033531,18.2803547 21.0033531,17.9997309 C21.0033531,17.7196073 20.7754304,17.5095146 20.4970248,17.4734988 C12.9730756,16.5010698 12.1628503,16.2654659 11.4550902,14.9043654 C10.7473302,13.5437652 8.17420251,8.34697281 8.17420251,8.34697281 C7.49043432,6.9788693 8.94594087,5.47820732 10.3449666,6.1775158 L31.1059281,16.553593 C32.298024,17.1488555 32.298024,18.8511065 31.1059281,19.4468693" fill="#363636"></path></g></g></svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
    )
  }
}

export default Board;