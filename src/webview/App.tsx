import * as React from "react";
import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { CodeInput } from "./CodeInput";
import "./App.css";

//declare const vscode: any;
const vscode = acquireVsCodeApi();

export const App: React.FC = () => {
    const [messages, setMessages] = useState<
        Array<{ role: string; content: string }>
    >([]);
    const [queryType, setQueryType] = useState("explain");

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        switch (message.command) {
            case "aiResponse":
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "ai", content: message.text },
                ]);
                break;
        }
    };

    const logState = () => {
      console.log('Current state:', { messages, queryType });
    };

    const handleSend = (code: string) => {
        // window.alert(queryType);
        // window.alert(code);
        // setMessages(prevMessages => [...prevMessages, { role: 'user', content: code }]);
        // console.log('Sending message:', { command: 'askAI', text: `${queryType}|||${code}` });
        // vscode.postMessage({ command: 'askAI', text: queryType + '|||' + code});

        console.log("Attempting to send message:", {
            command: "askAI",
            text: `${queryType}|||${code}`,
        });
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: code },
        ]);
        try {
            vscode.postMessage({
                command: "askAI",
                text: `${queryType}|||${code}`,
            });
        } catch (error) {
            console.error("Error posting message:", error);
            // Optionally, update UI to show error
        }
    };

    return (
        <div className="app">
            <div className="chat-container">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        role={msg.role}
                        content={msg.content}
                    />
                ))}
            </div>
            <div className="input-container">
                <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                >
                    <option value="explain">Explain Code</option>
                    <option value="optimize">Optimize Code</option>
                    <option value="debug">Debug Code</option>
                </select>
                <CodeInput onSend={handleSend} />
                <button onClick={logState}>Log State</button>
            </div>
        </div>
    );
};
