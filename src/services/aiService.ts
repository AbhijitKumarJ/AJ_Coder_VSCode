import { OpenAI } from "openai";

export class AIService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async handleQuery(queryType: string, code: string): Promise<string> {
        if(code=='')
        {
            console.log("query type:" + queryType);
            console.log("code: " + code);
            return "An error occurred while processing your query.";
        }

        let prompt = "";
        switch (queryType) {
            case "explain":
                prompt = `Explain the following code:\n\n${code}`;
                break;
            case "optimize":
                prompt = `Optimize the following code and explain the improvements:\n\n${code}`;
                break;
            case "debug":
                prompt = `Debug the following code and suggest fixes:\n\n${code}`;
                break;
            default:
                prompt = `Analyze the following code:\n\n${code}`;
        }

        console.log("prompt: " + prompt);

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini", //"gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
            });

            return (
                response.choices[0].message.content || "No response generated."
            );
        } catch (error) {
            console.error("Error handling query:", error);
            return "An error occurred while processing your query.";
        }
    }
}
