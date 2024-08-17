import * as vscode from "vscode";
import { AIService } from "./services/aiService";
import { ChatPanel } from './panels/ChatPanel';

let aiService: AIService;

export function activate(context: vscode.ExtensionContext) {
    console.log("AI Coding Assistant is now active!");

    // Initialize AI service with API key
    const apiKey = vscode.workspace
        .getConfiguration()
        .get("aiCodingAssistant.apiKey") as string;
    aiService = new AIService(apiKey);

    context.subscriptions.push(
      vscode.commands.registerCommand('ai-coding-assistant.askAI', () => {
        ChatPanel.createOrShow(context.extensionUri, aiService);
      })
    );
    context.subscriptions.push(
      vscode.commands.registerCommand('ai-coding-assistant.openDevTools', () => {
        if (ChatPanel.currentPanel) {
          ChatPanel.currentPanel.openDevTools();
        }
      })
    );
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
