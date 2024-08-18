import { Anthropic } from '@anthropic-ai/sdk';
import { BaseAIService } from './baseAIService';

export class AnthropicService extends BaseAIService {
  private anthropic: Anthropic;
  name = 'Anthropic';
  _maxTokens=300;
  
  constructor(apiKey: string, maxTokens: number) {
    super();
    this.anthropic = new Anthropic({ apiKey });
  }

  async handleQuery(queryType: string, code: string): Promise<string> {
    if (code == '') {
        console.log("query type:" + queryType);
        console.log("code: " + code);
        return "An error occurred while processing your query.";
    }

    const prompt = this.createPrompt(queryType, code);

    try {
      const response = await this.anthropic.completions.create({
        model: "claude-3-5-sonnet-20240620",
        prompt: prompt,
        max_tokens_to_sample: this._maxTokens,
      });

      return response.completion || "No response generated.";
    } catch (error) {
      console.error('Error handling query:', error);
      return "An error occurred while processing your query.";
    }
  }
}



// Model names

// Model	            Anthropic API	            AWS Bedrock	                                GCP Vertex AI
// Claude 3.5 Opus	    Later this year	            Later this year	                            Later this year
// Claude 3.5 Sonnet	claude-3-5-sonnet-20240620	anthropic.claude-3-5-sonnet-20240620-v1:0	claude-3-5-sonnet@20240620
// Claude 3.5 Haiku	Later this year	            Later this year	                            Later this year

// Model	            Anthropic API	            AWS Bedrock	                                GCP Vertex AI
// Claude 3 Opus	    claude-3-opus-20240229	    anthropic.claude-3-opus-20240229-v1:0	    claude-3-opus@20240229
// Claude 3 Sonnet	    claude-3-sonnet-20240229	anthropic.claude-3-sonnet-20240229-v1:0	    claude-3-sonnet@20240229
// Claude 3 Haiku	    claude-3-haiku-20240307	    anthropic.claude-3-haiku-20240307-v1:0	    claude-3-haiku@20240307