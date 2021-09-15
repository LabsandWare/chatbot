/* @flow */
import React, { Component } from 'react';

import NavBar from './navbar';
import type { ChatMessage, MessageType } from './chatBoard';
import  Board from './chatBoard';
import { uuidv4 } from '../utils';


type ConnectedBotProps = {
  userId: string,
  host: string,
  welcomeMessage: ?string,
  waitingTimeout: number,
  messageBlacklist: Array<string>,
  fetchOptions?: RequesOptions
};

type ConnectedBotState = {
  messages: Array<ChatMessage>,
  messageQueue: Array<ChatMessage>,
  waitingForBotResponse: boolean
}

type RasaMessage = 
  | {| sender_id: string, text: string |}
  | {|
      sender_id: string,
      buttons: Array<{title: string,  payload: string, selected?: boolean }>,
      text?: string
    |}
  | {| sender_id: string, image: string, text?: string |}
  | {| sender_id: string, attachment: string, text?: string |};

class ConnectedBot extends Component<
  ConnectedBotProps,
  ConnectedBotState
> {
    
    state = {
      messages: [],
      messageQueue: [],
      waitingForBotResponse: false
    };

    static defaultProps = {
      waitingTimeout: 5000,
      messageBlacklist: ["restart", "start", "/restart", "/start"],
      host: process.env.REACT_APP_SERVER_URL,
      welcomeMessage: "Hi, I am Lara, Legalnaija Automated Research Assistant"
    };

    waitingForBotResponseTimer: ?TimeOutID = null;
    messageQueueInterval: ?IntervalID = null;
    botRef = React.createRef<Board>();

    componentDidMount() {
      const messageDelay = 800;
      this.messageQueueInterval = window.setInterval(
          this.queuedMessagesInterval,
          messageDelay
        );

      if (this.props.welcomeMessage) {
        const welcomeMessage = {
          message: {type: "text", text: this.props.welcomeMessage },
          username: "bot",
          uuid: uuidv4()
        };
        this.setState({messages: [welcomeMessage]})
      }
    }

    componentWillUnmount() {
      if (this.waitingForBotResponseTimer != null) {
        window.clearTimeout(this.waitingForBotResponseTimer);
        this.waitingForBotResponseTimer = null;
      }
      if (this.messageQueueInterval != null) {
        window.clearInterval(this.messageQueueInterval);
        this.messageQueueInterval = null;
      }
    }

    sendMessage = async (messageText: string) => {
      if (messageText === "") return;

      const messageObj = {
        message: {type: "text", text: messageText },
        username: this.props.userId,
        uuid: uuidv4()
      }

      if (!this.props.messageBlacklist.includes(messageText)) {
        this.setState({
          // Reveal all queued bot messages when the user sends a new message
          messages: [
            ...this.state.messages,
            ...this.state.messageQueue,
            messageObj
          ],
          messageQueue: []
        });
      }

      this.setState({ waitingForBotResponse: true });
      if (this.waitingForBotResponseTimer != null) {
        window.clearTimeout(this.waitingForBotResponseTimer);
      }
      this.waitingForBotResponseTimer = setTimeout(() => {
        this.setState({ waitingForBotResponse: false });
      }, this.props.waitingTimeout);

      const rasaMessageObj = {
        message: messageObj.message.text,
        sender: this.props.userId
      };

      const fetchOptions = Object.assign({}, {
        method: "POST",
        body: JSON.stringify(rasaMessageObj),
        headers: {
          "Content-Type": "application/json"
        }
      }, this.props.fetchOptions);

      const response = await fetch(
          `${this.props.host}/webhooks/rest/webhook`,
          fetchOptions
        );

      const messages = await response.json();

      this.parseMessages(messages);

      if (window.ga != null) {
        window.ga("send", "event", "chat", "chat-message-sent");
      }
    };

    createNewBotMessage(botMessageObj: MessageType) {
      return {
        message: botMessageObj,
        username: "bot",
        uuid: uuidv4()
      };
    }

    async parseMessages(RasaMessages: Array<RasaMessage>) {
      const validMessageTypes = ["text", "image", "buttons", "attachment"];

      let expandedMessages = [];

      RasaMessages.filter((message: RasaMessage) => 
        validMessageTypes.some(type => type in message)
        ).forEach((message: RasaMessage) => {
          let validMessage = false;
          if (message.text) {
            validMessage = true;
            expandedMessages.push(
              this.createNewBotMessage({type: "text", text: message.text })
            );
          }

          if (message.buttons) {
            validMessage = true;
            expandedMessages.push(
              this.createNewBotMessage({type: "button", buttons: message.buttons })
            );
          }

          if (message.image) {
            validMessage = true;
            expandedMessages.push(
              this.createNewBotMessage({ type: "image", image: message.image })
            );
          }

          // probably should be handled with special UI elements
          if (message.attachment) {
            validMessage = true;
            expandedMessages.push(
              this.createNewBotMessage({ type: "text", text: message.attachment })
            );
          }

          if (validMessage === false ) 
              throw Error("Could not parse message from Bot or empty message")

        });

      // Bot messages should be displayed in a queued manner. Not all at once
      const messageQueue = [...this.state.messageQueue, ...expandedMessages];
      this.setState({
        messageQueue,
        waitingForBotResponse: messageQueue.length > 0
      });
    }   

    queuedMessagesInterval = () => {
      const { messages, messageQueue } = this.state;
      
      if (messageQueue.length > 0) {
        const message = messageQueue.shift();
        const waitingForBotResponse = messageQueue.length > 0;

        this.setState({
          messages: [...messages, message],
          messageQueue,
          waitingForBotResponse
        });
      }
    };

    handleButtonClick = (buttonTitle: string, payload: string ) => {
      this.sendMessage(payload);
      if (window.ga != null) {
        window.ga("send", "event", "chat", "chat-button-click");
      }
    };    

    render() {

      const { messages, waitingForBotResponse } = this.state;

      const renderrableMessages = messages
        .filter(
          message => 
            message.message.type !== "text" || 
              !this.props.messageBlacklist.includes(message.message.text)
        )

      return (
        <section className="hero is-fullheight">
          <NavBar />
          <Board 
              messages={renderrableMessages}
              waitingForBotResponse={waitingForBotResponse}
              onButtonClick={this.handleButtonClick}
              onSendMessage={this.sendMessage}
              ref={this.botRef}
            />
        </section>
      );
    }

  }

export default  ConnectedBot;