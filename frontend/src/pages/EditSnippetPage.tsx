import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Combobox } from "../components/ui/combobox";
import { Badge } from "../components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateSnippetMutation, useGetOneSnippetQuery } from "@/store/slices/api/snippetApi";
import { toast } from "sonner";

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
    <span role="img" aria-label="ask-ai" className="text-yellow-400 mr-2 cursor-pointer select-none">✨</span>
  );
}

const EditSnippetPage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [updateSnippet, {isLoading}] = useUpdateSnippetMutation();
  const {id} = useParams();
  const {data: snippetData} = useGetOneSnippetQuery(
    { snippetId: id! },
    { skip: !id });
  const [tags, setTags] = useState<string[]>(snippetData?.tags || []);
    const [title, setTitle] = useState(snippetData?.title || "");
    const [code, setCode] = useState(snippetData?.code || "");
    const [language, setLanguage] = useState(snippetData?.language || "");
    const [framework, setFramework] = useState(snippetData?.framework || "");
    const [summary, setSummary] = useState(snippetData?.summary || "");


  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (snippetData) {
        setTags(snippetData.tags || []);
        setTitle(snippetData.title || "");
        setCode(snippetData.code || "");
        setLanguage(snippetData.language || "");
        setFramework(snippetData.framework || "");
        setSummary(snippetData.summary || "");
    }
  }, [snippetData]);

  const handleEditSnippet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !code.trim()) {
      toast.error("Title and code are required");
      return;
    }
    try {

      await updateSnippet({id: id!,title, code, tags, language, framework, summary: summary.trim()}).unwrap();
      toast.success("Snippet updated successfully");
    } catch (error) {
      toast.error("Failed to update snippet");
      console.error(error);
    }
    
  };

 

  const navigate = useNavigate();

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

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
      <form onSubmit={handleEditSnippet} className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">EDIT</h2>
          <Button type="submit" variant="ghost" className="px-6">UPDATE</Button>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="title">TITLE</Label>
                  <Input disabled={isLoading} 
                    id="title" 
                    placeholder="Enter snippet title" 
                    className="mt-1" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div>
                  <Label htmlFor="code">CODE</Label>
                  <textarea disabled={isLoading}
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="mt-1 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label>LANGUAGE</Label>
                  <Combobox value={language} onChange={setLanguage} options={LANGUAGES} placeholder="Select language..." />
                </div>
                <div>
                <Label>TAGS</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map(tag => (
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
                        SUMMARY 
                        <SparkleIcon />
                      </Label>
                      <textarea
                        disabled={isLoading}
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Let AI generate a summary for you..."
                        className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                    <div>
                      <Label>FRAMEWORK</Label>
                      <Combobox value = {framework} onChange={setFramework} options={FRAMEWORKS} placeholder="Select framework..." />
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

export default EditSnippetPage;