import React from 'react';

export const Sidebar = ({ activeTool, setActiveTool }: { activeTool: string; setActiveTool: (tool: string) => void }) => {
  return (
    <div className="w-64 bg-gray-900 h-screen text-white p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold tracking-tight">Marketing AI</h1>
      <nav className="flex flex-col gap-1">
        <button 
          className={`px-3 py-2 rounded-md text-left ${activeTool === 'blog' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTool('blog')}
        >
          Blog Generator
        </button>
        <button 
          className={`px-3 py-2 rounded-md text-left ${activeTool === 'planner' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTool('planner')}
        >
          Content Planner
        </button>
        <button 
          className={`px-3 py-2 rounded-md text-left ${activeTool === 'chatbot' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTool('chatbot')}
        >
          Marketing Bot
        </button>
        <button 
          className={`px-3 py-2 rounded-md text-left ${activeTool === 'keyword' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveTool('keyword')}
        >
          Keyword Khojo
        </button>
      </nav>
    </div>
  );
};
