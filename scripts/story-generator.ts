import { GoogleGenAI, Type } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // To load .env if running locally

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY environment variable is missing.");
  console.error("Please add it to your .env file or export it in your terminal.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function generateCharacter(prompt: string) {
  console.log(`\n✨ Generating character based on: "${prompt}"...\n`);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Create a detailed character profile based on this description: ${prompt}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The character's full name" },
            role: { type: Type.STRING, description: "Their role in the story (e.g., Protagonist, Antagonist, Mentor, Sidekick)" },
            description: { type: Type.STRING, description: "A detailed biography and physical description" },
            traits: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 key personality traits" 
            }
          },
          required: ["name", "role", "description", "traits"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini.");
    }

    const characterData = JSON.parse(response.text);
    
    // Add a unique ID and empty connections array to match our app's data structure
    characterData.id = `char-${Math.random().toString(36).substring(2, 9)}`;
    characterData.connections = [];

    console.log('✅ Generated Character:');
    console.log(JSON.stringify(characterData, null, 2));

    // Save to a file in the project root
    const outputDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `${characterData.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(characterData, null, 2));
    console.log(`\n💾 Saved to ${filePath}`);
    console.log(`You can now import this file into the Character Profile View in the app!`);
    
  } catch (error) {
    console.error("❌ Error generating character:", error);
  }
}

const args = process.argv.slice(2);
const prompt = args.join(' ');

if (!prompt) {
  console.error("❌ Please provide a character description.");
  console.error("Example: npm run generate:character 'A cynical detective in a cyberpunk city'");
  process.exit(1);
}

generateCharacter(prompt);
