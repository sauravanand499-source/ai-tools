/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentPlanner } from './components/ContentPlanner';
import { MarketingChatbot } from './components/MarketingChatbot';
import { KeywordTool } from './components/KeywordTool';
import { BlogGenerator } from './components/BlogGenerator';

export default function App() {
  const [activeTool, setActiveTool] = useState('planner');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 overflow-auto">
        {activeTool === 'planner' ? <ContentPlanner /> : activeTool === 'chatbot' ? <MarketingChatbot /> : activeTool === 'blog' ? <BlogGenerator /> : <KeywordTool />}
      </main>
    </div>
  );
}
