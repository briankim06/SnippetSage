import { Pinecone } from "@pinecone-database/pinecone";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.OPENAI_API_KEY) {
    throw new Error("Pinecone API key not found.");
}

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})
export const index = pc.index(process.env.PINECONE_INDEX_NAME, process.env.PINECONE_NAMESPACE);

