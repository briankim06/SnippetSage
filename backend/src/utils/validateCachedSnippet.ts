import { ISnippet } from "../models/Snippet";


export function isValidCachedSnippet(obj: any): obj is ISnippet {
    return obj && 
           typeof obj === 'object' && 
           typeof obj._id === 'string' &&
           typeof obj.title === 'string' && 
           typeof obj.code === 'string' && 
           typeof obj.userId === 'string';
  }
  