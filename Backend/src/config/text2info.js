import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export default async function textIntoProcessesdData(text, stage) {
    try {
        let processedSchema;
        if (stage === 2) {
            processedSchema = stage3ResponseSchema;
        }
        else if (stage === 4) {
            processedSchema = stage5ResponseSchema;
        }
        else if (stage === 6) {
            processedSchema = stage7ResponseSchema;
        }
        else {
            console.log("Invalid Stage for processed data generation: ", stage);
            return null;
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `analyze this text and find all keywords according to schema but if not found then file them blank. Text -> ${text}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: processedSchema,
            }
        });
        return response.text;
    }
    catch (e) {
        console.log("Error in textIntoProcessesdData: ", e);
        return null;
    }
}

// Stage 3: Early Life Stage
const stage3ResponseSchema = {
    type: Type.OBJECT,
    properties: {
        bornCity: { type: Type.STRING },
        homeTown: { type: Type.STRING },
        school: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                },
                propertyOrdering: ["name", "address"],
            },
        },
        college: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    course: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                },
                propertyOrdering: ["name", "address", "course"],
            },
        },
        earlyTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    propertyOrdering: ["bornCity", "homeTown", "school", "college", "earlyTags"],
};

// Stage 5: Professional Life Stage
const stage5ResponseSchema = {
    type: Type.OBJECT,
    properties: {
        previousCompany: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                },
                propertyOrdering: ["name", "role"],
            },
        },
        professionalTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    propertyOrdering: ["previousCompany", "professionalTags"],
};

// Stage 7: Current Life Stage
const stage7ResponseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING },
        currentCompany: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
            },
            propertyOrdering: ["name", "role"],
        },
        frequentCityLived: { type: Type.STRING },
        currentTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        skillTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    propertyOrdering: ["summary", "currentCompany", "frequentCityLived", "currentTags", "skillTags"],
};
