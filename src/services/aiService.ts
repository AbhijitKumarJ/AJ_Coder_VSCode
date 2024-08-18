import { OpenAI } from "openai";
import { BaseAIService } from "./baseAIService";

export class OpenAIService extends BaseAIService {
    private openai: OpenAI;
    name = 'OpenAI';
    _maxTokens=300;

    constructor(apiKey: string, maxTokens: number) {
        super();
        this.openai = new OpenAI({ apiKey });
        this._maxTokens=maxTokens;
    }

    async handleQuery(queryType: string, code: string): Promise<string> {
        if (code == '') {
            console.log("query type:" + queryType);
            console.log("code: " + code);
            return "An error occurred while processing your query.";
        }

        const prompt = this.createPrompt(queryType, code);

        console.log("prompt: " + prompt);

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini", //"gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: this._maxTokens
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
