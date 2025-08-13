import { groq } from '../config/clients'

const EXPLAIN_PROMPT = `
    You are an expert software developer who's task is to explain a user's code as succinctly and clearly as possible.
    The code can be written in any language. Assume that the user has a working understanding of the language. Don't explain
    syntax, and focus on explaining what the code does and why.
    Explain the overarching purpose of the code, key components, and how they work together. Don't explain the code line by line,
    but rather provide the user a high-level overview of the code.
`.trim();

const TRANSLATE_PROMPT = `
    You are an expert polyglot software developer who's task is to translate a user's code from the original language to the requested
    language. Do not return anything else other than the translated code and simple one line comments explaining verbose parts of the code.
    Keep these comments to a minimum. The translated code should be mirror the functionality and structure of the original code. 
`.trim();

class aiService {
    public async explainCode(code: string): Promise<string> {

        const userMessage = `Explain the following code: ${code}`;
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: userMessage
                },
                {
                    role: 'system',
                    content: EXPLAIN_PROMPT
                }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        return response.choices[0]?.message?.content || 'Error explaining code';
    }
  
    public async translateCode(code: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
        const userMessage = `Translate ${code} from ${sourceLanguage} to ${targetLanguage}`;

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: userMessage
                },
                {
                    role: 'system',
                    content: TRANSLATE_PROMPT
                }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        return response.choices[0]?.message?.content || 'Error translating code'
    }
}

export default new aiService();