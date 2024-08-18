import * as vscode from 'vscode';
import * as path from 'path';
import { OpenAIService } from '../services/aiService';

export class ChatPanel {
  public static currentPanel: ChatPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, aiService: OpenAIService) {
    this._panel = panel;

    this._panel.webview.html = this._getWebviewContent(extensionUri);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async message => {
        console.log('Received message in extension host:', message);
        switch (message.command) {
          case 'askAI':
            // eslint-disable-next-line no-case-declarations
            const [queryType, code] = message.text.split('|||');
            // eslint-disable-next-line no-case-declarations
            const response = await aiService.handleQuery(queryType.trim(), code.trim());
            this._panel.webview.postMessage({ command: 'aiResponse', text: response });
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public openDevTools() {
    this._panel.webview.postMessage({ command: 'openDevTools' });
  }

  public static createOrShow(extensionUri: vscode.Uri, aiService: OpenAIService) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ChatPanel.currentPanel) {
      ChatPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'aiChatPanel',
      'AI Chat',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')]
      }
    );

    ChatPanel.currentPanel = new ChatPanel(panel, extensionUri, aiService);
  }

  private _getWebviewContent(extensionUri: vscode.Uri) {
    const webviewUri = this._panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Chat</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="${webviewUri}"></script>
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