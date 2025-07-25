"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionnairePromptBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [value, setValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch("/api/questionnaire-prompt-builder");
        if (!res.ok) throw new Error("Failed to fetch prompt from server");
        const data = await res.json();
        if (data.prompt) {
          setPrompt(data.prompt);
          setValue(data.prompt);
        }
      } catch (err) {
        setPrompt('');
        setValue('');
      }
    };
    fetchPrompt();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/questionnaire-prompt-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      if (!res.ok) throw new Error("Failed to save prompt to server");
      setPrompt(value);
      router.push('/');
    } catch (err) {
      alert("Failed to save prompt to server");
    }
  };

  return (
    <main className="centered-container">
      <div className="modal-title" style={{marginBottom: 24}}>Interviewer Prompt</div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={8}
        className="modal-textarea"
        style={{marginBottom: 24, width: '100%'}}
      />
      <div className="flex-row-end">
        <button className="action-btn" onClick={handleSave}>Save</button>
        <button className="action-btn action-btn-light" onClick={() => router.push('/')}>Back</button>
      </div>
    </main>
  );
} 