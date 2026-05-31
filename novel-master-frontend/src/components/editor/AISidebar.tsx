import { useState } from 'react';
import { Sparkles, Wand2, Expand, RefreshCw, Eye, Lightbulb, ChevronRight, X } from 'lucide-react';

const styles = [
  { id: 'neutral', label: 'Neutral', desc: 'Clear, straightforward prose' },
  { id: 'hemingway', label: 'Hemingway', desc: 'Short, punchy sentences' },
  { id: 'tolkien', label: 'Tolkien', desc: 'Epic, lyrical fantasy' },
  { id: 'noir', label: 'Noir', desc: 'Gritty, atmospheric crime' },
  { id: 'romance', label: 'Romance', desc: 'Emotional, sensual' },
  { id: 'gothic', label: 'Gothic', desc: 'Dark, brooding, ornate' },
  { id: 'pulp', label: 'Pulp Sci-Fi', desc: 'Fast-paced, action-packed' },
];

export function AISidebar({ editorContent, onInsert }: { editorContent: string; onInsert: (text: string) => void }) {
  const [activeStyle, setActiveStyle] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [open, setOpen] = useState(true);

  const callAI = async (endpoint: string, body: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` },
        body: JSON.stringify({ ...body, style: activeStyle }),
      });
      return await res.json();
    } catch (e) { return null; } finally { setLoading(false); }
  };

  const onContinue = async () => {
    const data = await callAI('continue', { context: editorContent });
    if (data?.text) { setSuggestion(data.text); setIdeas([]); }
  };
  const onExpand = async () => {
    const last = editorContent.split('.').pop() || editorContent;
    const data = await callAI('expand', { text: last });
    if (data?.text) { setSuggestion(data.text); setIdeas([]); }
  };
  const onRewrite = async () => {
    const last = editorContent.split('.').pop() || editorContent;
    const data = await callAI('rewrite', { text: last });
    if (data?.text) { setSuggestion(data.text); setIdeas([]); }
  };
  const onDescribe = async () => {
    const words = editorContent.split(' ').slice(-3).join(' ');
    const data = await callAI('describe', { subject: words });
    if (data?.text) { setSuggestion(data.text); setIdeas([]); }
  };
  const onBrainstorm = async () => {
    const words = editorContent.split(' ').slice(-5).join(' ');
    const data = await callAI('brainstorm', { topic: words });
    if (data?.ideas) { setIdeas(data.ideas); setSuggestion(''); }
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed right-4 top-24 z-40 p-3 bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg text-white">
      <Sparkles className="w-5 h-5" />
    </button>
  );

  return (
    <div className="w-[300px] bg-[#0f0f1a] border-l border-gray-800 flex flex-col h-full">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-white text-sm">AI Co-Author</h3>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-800 rounded text-gray-400"><X className="w-3 h-3" /></button>
      </div>
      <div className="p-3 border-b border-gray-800">
        <label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Style</label>
        <select value={activeStyle} onChange={(e) => setActiveStyle(e.target.value)} className="w-full px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:border-purple-500">
          {styles.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <p className="text-gray-600 text-[10px] mt-0.5">{styles.find(s => s.id === activeStyle)?.desc}</p>
      </div>
      <div className="p-3 space-y-1.5">
        <button onClick={onContinue} disabled={loading} className="w-full flex items-center gap-2 px-2 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50"><Wand2 className="w-3 h-3 text-purple-400" /> Continue</button>
        <button onClick={onExpand} disabled={loading} className="w-full flex items-center gap-2 px-2 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50"><Expand className="w-3 h-3 text-blue-400" /> Expand</button>
        <button onClick={onRewrite} disabled={loading} className="w-full flex items-center gap-2 px-2 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50"><RefreshCw className="w-3 h-3 text-green-400" /> Rewrite</button>
        <button onClick={onDescribe} disabled={loading} className="w-full flex items-center gap-2 px-2 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50"><Eye className="w-3 h-3 text-yellow-400" /> Describe</button>
        <button onClick={onBrainstorm} disabled={loading} className="w-full flex items-center gap-2 px-2 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50"><Lightbulb className="w-3 h-3 text-orange-400" /> Brainstorm</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {loading && <div className="flex justify-center py-4"><div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" /></div>}
        {suggestion && !loading && (
          <div className="p-2 bg-gray-900 border border-gray-700 rounded-lg">
            <p className="text-gray-300 text-xs leading-relaxed mb-2">{suggestion}</p>
            <button onClick={() => onInsert(suggestion)} className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-medium rounded-lg flex items-center justify-center gap-1"><ChevronRight className="w-3 h-3" /> Insert</button>
          </div>
        )}
        {ideas.length > 0 && !loading && (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Ideas</p>
            {ideas.map((idea, i) => (
              <div key={i} className="p-2 bg-gray-900 border border-gray-700 rounded-lg">
                <p className="text-gray-300 text-xs">{idea}</p>
                <button onClick={() => onInsert(idea)} className="mt-1 text-[10px] text-purple-400 hover:text-purple-300">Use idea</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
