import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    throw new Error("Pinecone API key not found.");
}

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});


export const index = pc.index(process.env.PINECONE_INDEX_NAME, process.env.PINECONE_NAMESPACE);

