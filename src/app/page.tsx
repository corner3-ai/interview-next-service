"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="centered-container">
      <h1 className="title">LiveLounge</h1>
      <div className="button-group">
        <Link href="/questionnaire-prompt-builder">
          <button className="action-btn">Edit Prompt</button>
        </Link>
        <Link href="/call">
          <button className="action-btn">Start Interview</button>
        </Link>
      </div>
    </main>
  );
}
