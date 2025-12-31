"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('study_history') || '[]');
    setHistory(saved);
  }, []);

  const monHoc = [
    { id: 'toan', ten: 'Toán Học', icon: '📐', color: 'bg-blue-500' },
    { id: 'ly', ten: 'Vật Lý', icon: '⚛️', color: 'bg-indigo-600' },
    { id: 'hoa', ten: 'Hóa Học', icon: '🧪', color: 'bg-emerald-500' },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 p-6 pb-20">
      <div className="text-center mt-10 mb-10">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">STUDY ECOSYSTEM</h1>
        <p className="text-gray-500 text-sm italic">Học tập thông minh cùng AI</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {monHoc.map((m) => (
          <Link href={`/mon-hoc/${m.id}`} key={m.id} className={`${m.color} p-6 rounded-3xl shadow-lg flex items-center justify-between text-white active:scale-95 transition`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{m.icon}</span>
              <span className="text-xl font-bold">{m.ten}</span>
            </div>
            <span>→</span>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">📓 NHẬT KÝ GẦN ĐÂY</h2>
        <div className="space-y-4">
          {history.length > 0 ? history.map((item: any) => (
            <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-blue-500 uppercase">{item.mon} • {item.ngay}</p>
                <p className="text-xs text-gray-600 truncate">{item.cauTraLoi}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-400 italic text-center py-4">Chưa có bài giải nào...</p>
          )}
        </div>
      </div>
    </div>
  );
}