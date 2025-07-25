import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import SnippetSandboxPage from './pages/SnippetSandboxPage'
import ImportFromClipboardPage from './pages/ImportFromClipboardPage'
import BulkUploadPage from './pages/BulkUploadPage'
import CreateCollectionPage from './pages/CreateCollectionPage'
import { Toaster } from "@/components/ui/sonner"
import EditSnippetPage from './pages/EditSnippetPage'


function App() {

  return (
    <>
      <Toaster position = "top-center" />
      <div className="relative h-full w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/snippet-sandbox" element={<SnippetSandboxPage />} />
          <Route path="/snippets/:id" element={<EditSnippetPage />} />
          <Route path="/import-from-clipboard" element={<ImportFromClipboardPage />} />
          <Route path="/bulk-upload" element={<BulkUploadPage />} />
          <Route path="/create-collection" element={<CreateCollectionPage />} />
        </Routes>
      </div>
    </>
    
  )
}

export default App
