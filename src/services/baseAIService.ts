export interface AIProvider {
    name: string;
    handleQuery(queryType: string, code: string): Promise<string>;
}

export abstract class BaseAIService implements AIProvider {
    abstract name: string;
    abstract handleQuery(queryType: string, code: string): Promise<string>;

    protected createPrompt(queryType: string, code: string): string {
        switch (queryType) {
            case 'explain':
                return `Explain the following code:\n\n${code}`;
            case 'optimize':
                return `Optimize the following code and explain the improvements:\n\n${code}`;
            case 'debug':
                return `Debug the following code and suggest fixes:\n\n${code}`;
            case "analyze":
                return `Analyze the following code:\n\n${code}`;
            case "generate":
                return `Generate code based on given input:\n\n${code}`;
            default:
                return `Generate code based on given input:\n\n${code}`;
        }
    }
}