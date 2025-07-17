import  { ISnippet }  from "../models/Snippet";


export function validateSnippet (data: any, partial = false) {
    const errors: string[] = [];
    const must = <T extends keyof ISnippet>(k:T) => !partial || k in data;
    
    if (must('title') && typeof data.title !== 'string') {
        errors.push('Title must be a string')
    }

    if (must('code') && typeof data.code !== 'string') {
        errors.push('Code must be a string');
    }

    if (must('summary') && typeof data.summary !== 'string') {
        errors.push('Summary must be a string');
    }

    if (must('language') && typeof data.language !== 'string') {
        errors.push('Language must be a string');
    }

    if (must('framework') && typeof data.framework !== 'string') {
        errors.push('Framework must be a string');
    }

    if (must('tags') && !Array.isArray(data.tags)) {
         errors.push('Tags must be an array of strings');
    }

    return errors.length ? {ok: false, errors} : {ok: true}
}