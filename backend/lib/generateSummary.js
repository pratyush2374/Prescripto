import { GoogleGenerativeAI } from "@google/generative-ai";

const generateSummary = async (text) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            As a health analytics expert, analyze the following pdf text data of the user's report 
            this is the text from the report ${text} 
            Please provide a 100-150 word summary analyzing this data. Include:
            1. Key patterns or trends
            2. Any concerning values or improvements            

            Format the response as a cohesive paragraph without bullet points or sections.
            Also dont say sentences simlar to Without any xxxx data provided like that just say what you think based on the raw data that i have given to you please
            Dont start with a negative setting no data provided bla bla ...just day what you think a general overview on the text that is provided 

            only answer if the data is related to health else reply with simple text saying Invalid text in PDF
        `;

        const result = await model.generateContent(prompt);
        
        if (!result?.response?.text) {
            throw new Error("No response received from the AI model.");
        }
        
        return result.response.text();
    } catch (error) {
        console.error("Error in generateReport:", error.message || error);
        throw new Error(`Failed to generate report. Please try again.`);
    }
};

export default generateSummary;