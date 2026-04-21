import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
export const analyzeJob = async (profile, jobDescription) => {
    const systemInstruction = `
    You are an expert career coach and resume writer. 
    Analyze the user's profile against the provided job description.
    
    USER PROFILE:
    Name: ${profile.name}
    Skills: ${profile.skills?.join(', ')}
    Experience: ${profile.experience}
    Education: ${profile.education}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Return a detailed JSON object with:
    - matchScore: 0-100 score based on how well the candidate fits the role.
    - matchReason: A 2-3 sentence explanation for the score.
    - resumeBullets: An array of 3-4 tailored bullet points the user can add to their resume to better fit this specific role.
    - coverLetter: A full professional cover letter tailored to this company and role based on the user's profile.
    
    Return ONLY JSON. No preamble. No markdown code blocks.
  `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Analyze this application.",
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchScore: { type: Type.NUMBER },
                        matchReason: { type: Type.STRING },
                        resumeBullets: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        coverLetter: { type: Type.STRING }
                    },
                    required: ["matchScore", "matchReason", "resumeBullets", "coverLetter"]
                }
            }
        });
        const result = JSON.parse(response.text);
        return result;
    }
    catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
};
