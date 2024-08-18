import * as vscode from 'vscode';

export class ConfigurationPanel {
  public static currentPanel: ConfigurationPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    this._panel.webview.html = this._getWebviewContent();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'saveConfiguration':
            this._saveConfiguration(message.config);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public static createOrShow() {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ConfigurationPanel.currentPanel) {
      ConfigurationPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'aiCodingAssistantConfig',
      'AI Coding Assistant Configuration',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    ConfigurationPanel.currentPanel = new ConfigurationPanel(panel);
  }

  private _getWebviewContent() {
    const config = vscode.workspace.getConfiguration('aiCodingAssistant');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Coding Assistant Configuration</title>
      </head>
      <body>
        <h1>AI Coding Assistant Configuration</h1>
        <form id="configForm">
          <label for="provider">AI Provider:</label>
          <select id="provider" name="provider">
            <option value="openai" ${config.get('provider') === 'openai' ? 'selected' : ''}>OpenAI</option>
            <option value="anthropic" ${config.get('provider') === 'anthropic' ? 'selected' : ''}>Anthropic</option>
          </select>
          <br><br>
          <label for="apiKey">API Key:</label>
          <input type="password" id="apiKey" name="apiKey" value="${config.get('apiKey') || ''}">
          <br><br>
          <label for="maxTokens">Max Tokens:</label>
          <input type="number" id="maxTokens" name="maxTokens" value="${config.get('maxTokens') || 300}">
          <br><br>
          <button type="submit">Save Configuration</button>
        </form>
        <script>
          const vscode = acquireVsCodeApi();
          const form = document.getElementById('configForm');
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const config = Object.fromEntries(formData.entries());
            vscode.postMessage({ command: 'saveConfiguration', config });
          });
        </script>
      </body>
      </html>
    `;
  }

  private _saveConfiguration(config: any) {
    const configObject = vscode.workspace.getConfiguration('aiCodingAssistant');
    Object.keys(config).forEach(key => {
      configObject.update(key, config[key], vscode.ConfigurationTarget.Global);
    });
    vscode.window.showInformationMessage('AI Coding Assistant configuration saved. Please reload the window for changes to take effect.');
  }

  public dispose() {
    ConfigurationPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}