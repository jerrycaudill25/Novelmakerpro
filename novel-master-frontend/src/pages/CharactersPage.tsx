import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, User, Users } from 'lucide-react';

interface Character { character_id?: number; name: string; role: string; appearance: string; personality: string; backstory: string; goals: string; relationships: string; tags: string; }

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await fetch('/api/characters', { headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const save = async () => {
    if (!selected) return;
    const method = selected.character_id ? 'PUT' : 'POST';
    const url = selected.character_id ? `/api/characters/${selected.character_id}` : '/api/characters';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` }, body: JSON.stringify(selected) });
    await load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/characters/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
    setSelected(null); await load();
  };

  const blank = () => setSelected({ name: '', role: '', appearance: '', personality: '', backstory: '', goals: '', relationships: '', tags: '' });

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><Users className="w-7 h-7 text-purple-400" /><h1 className="text-2xl font-bold text-white">Characters</h1></div>
        <button onClick={blank} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium"><Plus className="w-4 h-4" /> New</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {characters.map(c => (
            <button key={c.character_id} onClick={() => setSelected(c)} className={`w-full text-left p-3 rounded-xl border transition-colors ${selected?.character_id === c.character_id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}>
              <p className="text-white font-medium text-sm">{c.name}</p>
              <p className="text-gray-500 text-xs">{c.role || 'No role'}</p>
            </button>
          ))}
          {characters.length === 0 && <div className="p-8 text-center text-gray-500 text-sm border border-dashed border-gray-800 rounded-xl">No characters yet.</div>}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-3 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Name</label><input value={selected.name} onChange={e => setSelected({...selected, name: e.target.value})} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
                <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Role</label><input value={selected.role} onChange={e => setSelected({...selected, role: e.target.value})} placeholder="Protagonist..." className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              </div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Appearance</label><textarea value={selected.appearance} onChange={e => setSelected({...selected, appearance: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Personality</label><textarea value={selected.personality} onChange={e => setSelected({...selected, personality: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Backstory</label><textarea value={selected.backstory} onChange={e => setSelected({...selected, backstory: e.target.value})} rows={3} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Goals</label><textarea value={selected.goals} onChange={e => setSelected({...selected, goals: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Relationships</label><textarea value={selected.relationships} onChange={e => setSelected({...selected, relationships: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Tags</label><input value={selected.tags} onChange={e => setSelected({...selected, tags: e.target.value})} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Save</button>
                {selected.character_id && <button onClick={() => del(selected.character_id!)} className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border border-dashed border-gray-800 rounded-xl"><User className="w-12 h-12 mb-4 text-gray-700" /><p>Select a character or create new</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
