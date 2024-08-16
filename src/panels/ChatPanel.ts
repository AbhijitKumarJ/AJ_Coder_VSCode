import * as vscode from "vscode";
import { AIService } from "../services/aiService";

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, aiService: AIService) {
        this._panel = panel;

        this._panel.webview.html = this._getWebviewContent();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case "askAI":
                        // eslint-disable-next-line no-case-declarations
                        const [queryType, code] = message.text.split("|||");
                        // eslint-disable-next-line no-case-declarations
                        const response = await aiService.handleQuery(
                            queryType.trim(),
                            code.trim()
                        );
                        this._panel.webview.postMessage({
                            command: "aiResponse",
                            text: response,
                        });
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow(extensionUri: vscode.Uri, aiService: AIService) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            "aiChatPanel",
            "AI Chat",
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );

        ChatPanel.currentPanel = new ChatPanel(panel, aiService);
    }

    private _getWebviewContent() {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Chat</title>
      </head>
      <body>
        <div id="chat-container"></div>
        <select id="query-type">
            <option value="explain">Explain Code</option>
            <option value="optimize">Optimize Code</option>
            <option value="debug">Debug Code</option>
        </select>
        <textarea id="code-input" placeholder="Paste your code here..."></textarea>
        <button id="send-button">Send</button>

        <script>
          const vscode = acquireVsCodeApi();
          const chatContainer = document.getElementById('chat-container');
          const userInput = document.getElementById('user-input');
          const sendButton = document.getElementById('send-button');

          sendButton.addEventListener('click', () => {
            const queryType = document.getElementById('query-type').value;
            const code = document.getElementById('code-input').value;
            if (code) {
                appendMessage('You asked to ' + queryType + ': ');
                appendMessage(code);
                vscode.postMessage({ command: 'askAI', text: queryType + '|||' + code });
                document.getElementById('code-input').value = '';
            }
          });

          window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
              case 'aiResponse':
                appendMessage('AI: ' + message.text);
                break;
            }
          });

          function appendMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            chatContainer.appendChild(messageElement);
          }
        </script>
      </body>
      </html>
    `;
    }

    public dispose() {
        ChatPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
