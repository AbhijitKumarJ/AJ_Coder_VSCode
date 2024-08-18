import * as vscode from "vscode";
import { OpenAIService } from "./services/aiService";
//import { ChatPanel } from './panels/ChatPanel';
import { ChatViewProvider } from './panels/ChatViewProvider';
import { HistoryService } from "./services/historyService";
import { AIProvider } from "./services/baseAIService";
import { AnthropicService } from "./services/anthropicService";
import { ConfigurationPanel } from "./configurationPanel";

let aiProvider: AIProvider;
let historyService: HistoryService;

export function activate(context: vscode.ExtensionContext) {
    console.log("AI Coding Assistant is now active!");

    // Initialize AI service 
    const config = vscode.workspace.getConfiguration('aiCodingAssistant');
    const provider = config.get('provider') as string;
    const apiKey = config.get("apiKey") as string;
    const maxTokens = config.get('maxTokens') as number;
        
  
    switch (provider) {
      case 'openai':
        aiProvider = new OpenAIService(apiKey, maxTokens);
        break;
      case 'anthropic':
        aiProvider = new AnthropicService(apiKey, maxTokens);
        break;
      default:
        aiProvider = new OpenAIService(apiKey, maxTokens);
    }

    historyService = new HistoryService(context);
    // context.subscriptions.push(
    //   vscode.commands.registerCommand('ai-coding-assistant.askAI', () => {
    //     ChatPanel.createOrShow(context.extensionUri, aiService);
    //   })
    // );
    // context.subscriptions.push(
    //   vscode.commands.registerCommand('ai-coding-assistant.openDevTools', () => {
    //     if (ChatPanel.currentPanel) {
    //       ChatPanel.currentPanel.openDevTools();
    //     }
    //   })
    // );

    const chatViewProvider = new ChatViewProvider(context.extensionUri, aiProvider, historyService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('aiChatView', chatViewProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ai-coding-assistant.askAI', () => {
            vscode.commands.executeCommand('workbench.view.extension.ai-coding-assistant');
        })
    );

    const configureCommand = vscode.commands.registerCommand('ai-coding-assistant.configure', () => {
      ConfigurationPanel.createOrShow();
    });
  
    context.subscriptions.push(configureCommand);
    
    // const disposable = vscode.commands.registerCommand(
    //     "ai-coding-assistant.askAI",
    //     async () => {
    //         const editor = vscode.window.activeTextEditor;
    //         if (!editor) {
    //             vscode.window.showErrorMessage("No active text editor");
    //             return;
    //         }

    //         const selection = editor.selection;
    //         const text = editor.document.getText(selection);

    //         const prompt = await vscode.window.showInputBox({
    //             prompt: "What would you like the AI to do?",
    //             placeHolder:
    //                 "e.g., Explain this code, Optimize this function, etc.",
    //         });

    //         if (!prompt) return;

    //         const fullPrompt = `${prompt}\n\nCode:\n${text}`;

    //         vscode.window.withProgress(
    //             {
    //                 location: vscode.ProgressLocation.Notification,
    //                 title: "AI is thinking...",
    //                 cancellable: false,
    //             },
    //             async (progress) => {
    //                 let response = await aiService.generateCode(fullPrompt);
    //                 editor.edit((editBuilder) => {
    //                     response=fullPrompt + "\n\nResponse: \n\n" + response;
    //                     editBuilder.replace(selection, response);
    //                 });
    //             }
    //         );
    //     }
    // );

    // context.subscriptions.push(disposable);
}
