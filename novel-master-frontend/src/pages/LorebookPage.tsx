import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Tag, Link2 } from 'lucide-react';

interface LoreEntry { lore_id?: number; title: string; category: string; content: string; linked_characters: string; linked_timelines: string; tags: string; }

const categories = ['World', 'Magic System', 'Location', 'Faction', 'History', 'Creature', 'Item', 'Other'];

export default function LorebookPage() {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [selected, setSelected] = useState<LoreEntry | null>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await fetch('/api/lore', { headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const save = async () => {
    if (!selected) return;
    const method = selected.lore_id ? 'PUT' : 'POST';
    const url = selected.lore_id ? `/api/lore/${selected.lore_id}` : '/api/lore';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` }, body: JSON.stringify(selected) });
    await load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/lore/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
    setSelected(null); await load();
  };

  const blank = () => setSelected({ title: '', category: 'World', content: '', linked_characters: '', linked_timelines: '', tags: '' });
  const filtered = filter === 'All' ? entries : entries.filter(e => e.category === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><BookOpen className="w-7 h-7 text-purple-400" /><h1 className="text-2xl font-bold text-white">Lorebook</h1></div>
        <button onClick={blank} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium"><Plus className="w-4 h-4" /> New Entry</button>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter('All')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === 'All' ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>All</button>
        {categories.map(c => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === c ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>{c}</button>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filtered.map(e => (
            <button key={e.lore_id} onClick={() => setSelected(e)} className={`w-full text-left p-3 rounded-xl border transition-colors ${selected?.lore_id === e.lore_id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}>
              <div className="flex items-center justify-between"><p className="text-white font-medium text-sm">{e.title}</p><span className="text-xs text-gray-500">{e.category}</span></div>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{e.content}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-3 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <input value={selected.title} onChange={e => setSelected({...selected, title: e.target.value})} placeholder="Title..." className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-lg font-medium focus:border-purple-500" />
              <select value={selected.category} onChange={e => setSelected({...selected, category: e.target.value})} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <textarea value={selected.content} onChange={e => setSelected({...selected, content: e.target.value})} rows={8} placeholder="Write your lore entry..." className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block flex items-center gap-1"><Link2 className="w-3 h-3" /> Characters</label><input value={selected.linked_characters} onChange={e => setSelected({...selected, linked_characters: e.target.value})} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
                <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block flex items-center gap-1"><Link2 className="w-3 h-3" /> Timelines</label><input value={selected.linked_timelines} onChange={e => setSelected({...selected, linked_timelines: e.target.value})} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              </div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block flex items-center gap-1"><Tag className="w-3 h-3" /> Tags</label><input value={selected.tags} onChange={e => setSelected({...selected, tags: e.target.value})} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium">Save Entry</button>
                {selected.lore_id && <button onClick={() => del(selected.lore_id!)} className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border border-dashed border-gray-800 rounded-xl"><BookOpen className="w-12 h-12 mb-4 text-gray-700" /><p>Select an entry or create new</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
