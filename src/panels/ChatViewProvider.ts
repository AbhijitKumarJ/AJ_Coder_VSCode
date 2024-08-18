import * as vscode from 'vscode';
import { AIProvider } from '../services/baseAIService';
import { HistoryService } from '../services/historyService';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _aiProvider: AIProvider,
        private readonly historyService: HistoryService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'askAI':
                    // eslint-disable-next-line no-case-declarations
                    const [queryType, code] = data.value.split('|||');
                    // eslint-disable-next-line no-case-declarations
                    const response = await this._aiProvider.handleQuery(queryType.trim(), code.trim());
                    await this.historyService.saveMessage({ role: 'user', content: `${queryType}:\n\n${code}`, timestamp: Date.now() });
                    await this.historyService.saveMessage({ role: 'ai', content: response, timestamp: Date.now() });
            
                    webviewView.webview.postMessage({ type: 'aiResponse', value: response });
                    break;
                case 'getHistory':
                    // eslint-disable-next-line no-case-declarations
                    const history = await this.historyService.getHistory();
                    webviewView.webview.postMessage({ type: 'historyLoaded', history });
                    return;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));

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
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }
}