import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('AI Coding Assistant is now active!');

  const disposable = vscode.commands.registerCommand('ai-coding-assistant.askAI', () => {
    vscode.window.showInformationMessage('Hello from AI Coding Assistant!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}