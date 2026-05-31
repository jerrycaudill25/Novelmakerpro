import { useEffect, useState } from 'react';
import { HardDrive, ArrowUpRight } from 'lucide-react';

export function StorageIndicator() {
  const [s, setS] = useState<any>(null);
  useEffect(() => {
    fetch('/api/user/storage', { headers: { 'Authorization': `Bearer ${localStorage.getItem('nm_token')}` } })
      .then(r => r.json()).then(setS).catch(() => {});
  }, []);
  if (!s) return null;
  const wp = Math.min((s.writing_used_mb / s.writing_limit_mb) * 100, 100);
  const mp = Math.min((s.media_used_mb / s.media_limit_mb) * 100, 100);
  return (
    <div className="px-4 py-3 border-t border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-400 text-xs"><HardDrive className="w-3.5 h-3.5" /><span className="capitalize">{s.tier} Plan</span></div>
        <span className="text-xs text-gray-500">{s.storage_used_mb.toFixed(0)} / {s.storage_limit_mb} MB</span>
      </div>
      <div className="space-y-1.5">
        <div><div className="flex justify-between text-[10px] text-gray-500 mb-0.5"><span>Writing</span><span>{wp.toFixed(0)}%</span></div><div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${wp}%` }} /></div></div>
        <div><div className="flex justify-between text-[10px] text-gray-500 mb-0.5"><span>Media</span><span>{mp.toFixed(0)}%</span></div><div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${mp}%` }} /></div></div>
      </div>
      {s.tier === 'free' && <button className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-[10px] font-medium rounded-lg transition-colors">Upgrade <ArrowUpRight className="w-3 h-3" /></button>}
    </div>
  );
}
