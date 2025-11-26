import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenRouter } from '@openrouter/sdk';
import { GenerateEssayInput } from './dto/generate-essay.input';
import { EssayResponse } from './types/essay-response.type';

@Injectable()
export class EssayService {
  private openRouter: OpenRouter;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPEN_ROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPEN_ROUTER_API_KEY is not configured');
    }
    this.openRouter = new OpenRouter({ apiKey });
  }

  async generateEssay(input: GenerateEssayInput): Promise<EssayResponse> {
    const { exercise_record, emotion, user_additional_thoughts } = input;

    const prompt = `You are an AI model tasked with writing essays based on user input. Your goal is to create a coherent and emotionally resonant essay in Korean using the information provided by the user about their exercise experiences.

You will receive three inputs:

<exercise_record>
${exercise_record}
</exercise_record>

This contains the user's exercise record.

<emotion>
${emotion}
</emotion>

This describes the emotions felt by the user during their exercise experience.

<user_additional_thoughts>
${user_additional_thoughts}
</user_additional_thoughts>

This includes any additional thoughts or stories the user wants to share.

Using these inputs, create an essay that incorporates the user's exercise record, emotions, and personal story. Follow these guidelines:

1. Write the essay entirely in Korean.
2. Create a title that is no longer than 30 characters.
3. Limit the essay content to a maximum of 500 characters.
4. The essay content should include appropriate line breaks (using \\n) to make it more readable. Break long sentences into paragraphs where natural.
5. Create a comment as if someone read this essay and is naturally responding to it. The comment should be empathetic, encouraging, or relate to the essay content.
6. Limit the comment to a maximum of 30 characters.
7. Organize the information coherently, ensuring a smooth flow between the exercise record, emotions, and personal story.
8. Maintain the user's tone and perspective throughout the essay.

Your response should be in the following JSON format:

{
    "title": "에세이 제목",
    "content": "에세이 내용 (적절한 줄바꿈 포함)",
    "comment": "에세이에 대한 자연스러운 댓글"
}

Important reminders:
- Do not exceed the character limits for the title (30 characters), content (500 characters), and comment (30 characters).
- Include line breaks (\\n) in the content for better readability.
- The comment should sound natural, as if written by someone who genuinely read and was moved by the essay.
- Ensure that your entire response is in valid JSON format.
- Text containing code snippets outside the JSON structure is removed.
- Do not use placeholder text; write a complete essay based on the provided inputs.`;

    try {
      const response = await this.openRouter.chat.send({
        model: 'google/gemma-3n-e4b-it:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      });

      const content = response.choices[0]?.message?.content;
      console.log(content);
      if (!content) {
        throw new Error('Unexpected response from OpenRouter API');
      }

      const cleanedContent = (content as string).replace(/```json/g, '').replace(/```/g, '');
      const essayData = JSON.parse(cleanedContent);
      return {
        title: essayData.title,
        content: essayData.content,
        comment: essayData.comment,
      };
    } catch (error) {
      console.error('Error generating essay:', error);
      throw new Error('Failed to generate essay');
    }
  }
}
