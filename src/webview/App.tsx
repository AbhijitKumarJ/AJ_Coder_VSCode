import * as React from "react";
import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { CodeInput } from "./CodeInput";
import "./App.css";

//declare const acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();
interface Message {
    role: string;
    content: string;
    timestamp: number;
}

export const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [queryType, setQueryType] = useState("generate");

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        vscode.postMessage({ type: "getHistory" });
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        switch (message.type) {
            case "aiResponse":
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        role: "ai",
                        content: message.value,
                        timestamp: Date.now(),
                    },
                ]);
                break;
            case "historyLoaded":
                setMessages(message.history);
                break;
        }
    };

    const handleSend = (code: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: `${queryType}:\n\n${code}`, timestamp: Date.now() },
        ]);
        vscode.postMessage({ type: "askAI", value: `${queryType}|||${code}` });
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
                    <option value="analyze">Analyze Code</option>
                    <option value="generate">Generate Code</option>
                </select>
                <CodeInput onSend={handleSend} />
            </div>
        </div>
    );
};
