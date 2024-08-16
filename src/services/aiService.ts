import { OpenAI } from "openai";

export class AIService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async generateCode(prompt: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",//"gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
            });

            return (
                response.choices[0].message.content || "No response generated."
            );
        } catch (error) {
            console.error("Error generating code:", error);
            return "An error occurred while generating code.";
        }
    }
}
