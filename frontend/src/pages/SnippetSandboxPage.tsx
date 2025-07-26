import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Combobox } from "../components/ui/combobox";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCreateSnippetMutation } from "@/store/slices/api/snippetApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { selectDraft, selectIsSaving, selectError } from "@/store/selectors/snippetSelectors"
import { setDraft, clearDraft, updateDraftField, addDraftTag, removeDraftTag, setDraftSaving, setDraftError } from "@/store/slices/snippetSlice";
import type { RootState } from "@/store/store";

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  
];
const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "spring", label: "Spring" },
  { value: "django", label: "Django" },
  { value: ".net", label: ".NET" }
];

function SparkleIcon() {
  return (
    <span role="img" aria-label="sparkle" className="text-yellow-400 mr-2 cursor-pointer select-none">✨</span>
  );
}

const SnippetSandBoxPage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [createSnippet, {isLoading}] = useCreateSnippetMutation();
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const isSaving = useSelector(selectIsSaving);
  const error = useSelector(selectError);

  const handleCreateSnippet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(setDraftSaving(true));

    if (!draft.title.trim() || !draft.code.trim()) {
      toast.error("Title and code are required");
      dispatch(setDraftSaving(false));
      return;
    }
    try {
      await createSnippet({title: draft.title, code: draft.code, tags: draft.tags, language: draft.language, framework: draft.framework, summary: draft.summary.trim()}).unwrap();
      toast.success("Snippet created successfully");
      dispatch(clearDraft());
    } catch (err: any) {
      toast.error("Failed to create snippet");
      const msg = err?.data?.message ?? "Failed to create snippet";
      dispatch(setDraftError(msg));

    } finally {
      dispatch(setDraftSaving(false));
    }
    
  };

 

  const navigate = useNavigate();

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!draft.tags.includes(tagInput.trim())) {
        dispatch(addDraftTag(tagInput.trim()))
      }
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => dispatch(removeDraftTag(tag));

  return (
    <div className="min-h-screen bg-snip-pink-light flex flex-col items-center py-12">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <span className="text-white text-xl">Creating snippet...</span>
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="absolute top-6 left-6"
        onClick={() => navigate("/")}
      >
        ← Back
      </Button>
      <form onSubmit={handleCreateSnippet} className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Create Snippet</h2>
          <Button type="submit" variant="ghost" className="px-6">Create Snippet</Button>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input disabled={isLoading} 
                    id="title" 
                    placeholder="Enter snippet title" 
                    className="mt-1" 
                    value={draft.title}
                    onChange={(e) => dispatch(updateDraftField({field: "title", value: e.target.value}))} 
                    />
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <textarea disabled={isLoading}
                    id="code"
                    value={draft.code}
                    onChange={(e) => dispatch(updateDraftField({field: "code", value: e.target.value}))}
                    placeholder="Paste your code here..."
                    className="mt-1 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Combobox value={draft.language} onChange={(value) => dispatch(updateDraftField({field: "language", value}))} options={LANGUAGES} placeholder="Select language..." />
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {draft.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-xs">×</button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    disabled={isLoading}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tag and press Enter"
                    className="mt-2"
                  />
                </div>
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-6">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant="ghost"
                  className="self-end mb-2"
                  onClick={() => setShowAdvanced(v => !v)}
                >
                  {showAdvanced ? "Hide Advanced" : "Show Advanced"}
                </Button>
                {showAdvanced && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <div>
                      <Label htmlFor="summary" className="flex items-center">
                        <SparkleIcon />Summary
                      </Label>
                      <textarea
                        disabled={isLoading}
                        id="summary"
                        value={draft.summary}
                        onChange={(e) => dispatch(updateDraftField({field: "summary", value: (e.target.value)}))}
                        placeholder="Let AI generate a summary for you..."
                        className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                    <div>
                      <Label>Framework</Label>
                      <Combobox value = {draft.framework} onChange={(value) => dispatch(updateDraftField({field: "framework", value: value}))} options={FRAMEWORKS} placeholder="Select framework..." />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default SnippetSandBoxPage;