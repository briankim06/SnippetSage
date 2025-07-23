import mongoose, { Schema, Document } from 'mongoose';

export interface ISnippet extends Document {
    userId: string,
    title: string;
    code: string;
    language?: string;
    framework?: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
    summary?: string;
    embeddingVector?: number[]
}

const SnippetSchema: Schema = new Schema<ISnippet>({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    code: {type: String, required: true},
    language: {type: String},
    framework: {type: String}, 
    tags: {type: [String]},
    summary: {type: String},
    embeddingVector: {type: [Number]},
}, {timestamps: true});

export default mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', SnippetSchema);