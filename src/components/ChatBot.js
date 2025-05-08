import React, { Component } from "react";
import "./ChatBot.scss";

class ChatBot extends Component {
    state = {
        isOpen: false,
        messages: [],
        inputMessage: "",
    };

    toggleChat = () => {
        this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
    };

    handleInputChange = (e) => {
        this.setState({ inputMessage: e.target.value });
    };

    handleSendMessage = () => {
        const { inputMessage, messages } = this.state;
        if (inputMessage.trim()) {
            this.setState({
                messages: [...messages, { sender: "user", text: inputMessage }],
                inputMessage: "",
            });
        }
    };

    render() {
        const { isOpen, messages, inputMessage } = this.state;

        return (
            <div className="chat-bot">
                <div className="chat-icon" onClick={this.toggleChat}>
                    💬
                </div>
                {isOpen && (
                    <div className="chat-window">
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${
                                        msg.sender === "user" ? "user" : "bot"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={this.handleInputChange}
                                placeholder="Nhập tin nhắn..."
                            />
                            <button onClick={this.handleSendMessage}>
                                Gửi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ChatBot;
