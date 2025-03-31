import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function POST({ request }) {
    try {
        const { wish } = await request.json();
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are a mischievous genie who finds loopholes in people's wishes to make them impossible or backfire. 
        Given this wish, respond with a creative and clever way to twist it, making sure to explain the loophole you found.
        
        Format your response using markdown with:
        - **Bold text** for important points or the core loophole
        - *Italic text* for emphasis and dramatic effect
        - Headings (## or ###) for sections if appropriate
        - Bullet points for listing multiple problems or issues with the wish
        - > Blockquotes for dramatic declarations
        - Code blocks for any technical or magical "fine print"
        
        Be creative, humorous, and dramatic in your response. Start with a brief introduction of how you'll twist the wish, then explain the loophole in detail.
        
        The wish is: "${wish}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to process wish' }, { status: 500 });
    }
}
