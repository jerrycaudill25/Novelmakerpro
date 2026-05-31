import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';

interface TEvent { event_id?: number; title: string; description: string; date_text: string; chapter_ref: string; sort_order: number; }
interface Timeline { timeline_id?: number; title: string; description: string; events: TEvent[]; }

export default function TimelinePage() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [selected, setSelected] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await fetch('/api/timelines', { headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
      const data = await res.json();
      setTimelines(data.timelines || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const create = async () => {
    const title = prompt('Timeline title:');
    if (!title) return;
    await fetch('/api/timelines', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` }, body: JSON.stringify({ title }) });
    await load();
  };

  const addEvent = async () => {
    if (!selected?.timeline_id) return;
    const title = prompt('Event title:');
    if (!title) return;
    await fetch(`/api/timelines/${selected.timeline_id}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` }, body: JSON.stringify({ title, sort_order: selected.events?.length || 0 }) });
    const updated = await fetch('/api/timelines', { headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } }).then(r => r.json());
    const t = updated.timelines?.find((tl: Timeline) => tl.timeline_id === selected.timeline_id);
    if (t) setSelected(t);
    setTimelines(updated.timelines || []);
  };

  const del = async (id: number) => {
    if (!confirm('Delete timeline and all events?')) return;
    await fetch(`/api/timelines/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } });
    setSelected(null); await load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><Clock className="w-7 h-7 text-purple-400" /><h1 className="text-2xl font-bold text-white">Timelines</h1></div>
        <button onClick={create} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium"><Plus className="w-4 h-4" /> New Timeline</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {timelines.map(t => (
            <button key={t.timeline_id} onClick={() => setSelected(t)} className={`w-full text-left p-3 rounded-xl border transition-colors ${selected?.timeline_id === t.timeline_id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}>
              <p className="text-white font-medium text-sm">{t.title}</p>
              <p className="text-gray-500 text-xs">{t.events?.length || 0} events</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <button onClick={() => selected.timeline_id && del(selected.timeline_id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
              <button onClick={addEvent} className="mb-4 flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Event</button>
              <div className="space-y-3">
                {(selected.events || []).map((ev, i) => (
                  <div key={ev.event_id || i} className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                    <div className="flex flex-col items-center min-w-[60px]"><Calendar className="w-5 h-5 text-purple-400 mb-1" /><span className="text-xs text-gray-500">{ev.date_text || 'TBD'}</span></div>
                    <div className="flex-1"><p className="text-white font-medium text-sm">{ev.title}</p><p className="text-gray-400 text-xs mt-1">{ev.description}</p>{ev.chapter_ref && <p className="text-gray-600 text-xs mt-1">Chapter: {ev.chapter_ref}</p>}</div>
                  </div>
                ))}
                {(!selected.events || selected.events.length === 0) && <p className="text-gray-500 text-sm text-center py-8">No events yet.</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border border-dashed border-gray-800 rounded-xl"><Clock className="w-12 h-12 mb-4 text-gray-700" /><p>Select a timeline</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
