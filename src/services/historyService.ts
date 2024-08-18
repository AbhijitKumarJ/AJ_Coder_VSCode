import * as vscode from 'vscode';

interface ChatMessage {
  role: string;
  content: string;
  timestamp: number;
}

export class HistoryService {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async saveMessage(message: ChatMessage): Promise<void> {
    const history = await this.getHistory();
    history.push(message);
    await this.context.globalState.update('chatHistory', history);
  }

  async getHistory(): Promise<ChatMessage[]> {
    return this.context.globalState.get('chatHistory', []);
  }

  async clearHistory(): Promise<void> {
    await this.context.globalState.update('chatHistory', []);
  }
}