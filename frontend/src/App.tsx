import { useState } from 'react'
import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import SnippetViewPage from './pages/SnippetViewPage'
import AISnippetViewPage from './pages/AISnippetViewPage'
import AIPlaygroundPage from './pages/AIPlaygroundPage'


function App() {

  return (
    <div className="relative h-full w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/snippet-view" element={<SnippetViewPage />} />
        <Route path="/ai-snippet-view" element={<AISnippetViewPage />} />
        <Route path="/ai-playground" element={<AIPlaygroundPage />} />
      </Routes>
    </div>
  )
}

export default App
