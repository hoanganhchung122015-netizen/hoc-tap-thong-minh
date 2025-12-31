"use client"
import { useState } from 'react';

export default function StudyPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);

  // Hàm xử lý chọn ảnh và chuyển sang Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

 const handleExecute = async () => {
  if (!image) return alert("Vui lòng chụp hoặc chọn ảnh!");
  setLoading(true);

  try {
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monHoc: params.id, imageBase64: image }),
    });
    
    const result = await res.json();
    
    if (result.error) {
      alert("Lỗi AI: " + result.error);
    } else {
      setData(result);

      // --- LƯU NHẬT KÝ (Phải nằm trong này để lấy được biến result) ---
      const historyItem = {
        id: Date.now(),
        mon: params.id, // Dùng params.id cho đồng bộ
        cauTraLoi: result.p1.txt,
        ngay: new Date().toLocaleString('vi-VN'),
        image: image // Lưu ảnh dạng base64 để xem lại
      };

      const currentHistory = JSON.parse(localStorage.getItem('study_history') || '[]');
      const newHistory = [historyItem, ...currentHistory].slice(0, 10);
      localStorage.setItem('study_history', JSON.stringify(newHistory));
      // ------------------------------------------------------------
    }
  } catch (e) {
    console.error(e);
    alert("Có lỗi xảy ra khi kết nối máy chủ!");
  } finally {
    setLoading(false); // Luôn tắt loading dù thành công hay thất bại
  }
};

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'vi-VN';
    msg.rate = 1.1;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-6 uppercase text-center">Môn: {params.id}</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <label className="bg-gray-100 p-6 rounded-2xl text-center cursor-pointer border-2 border-dashed border-gray-300">
          📷 Chụp ảnh
          <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden"/>
        </label>
        <label className="bg-gray-100 p-6 rounded-2xl text-center cursor-pointer border-2 border-dashed border-gray-300">
          📁 Tải ảnh
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
        </label>
      </div>

      {image && <img src={image} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-4 border" />}

      <button onClick={handleExecute} disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${loading ? 'bg-gray-400' : 'bg-blue-600 active:scale-95'}`}>
        {loading ? "ĐANG GIẢI BÀI..." : "THỰC HIỆN"}
      </button>

      {data && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4 text-xs font-bold">
            {[1, 2, 3].map(i => (
              <button key={i} onClick={() => setTab(i)} className={`flex-1 py-2 rounded-lg ${tab === i ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>PROFESSOR {i}</button>
            ))}
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl relative border border-blue-100 min-h-[150px]">
            <button onClick={() => speak(data[`p${tab}`].key)} className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">🔊</button>
            <p className="text-gray-800 text-sm whitespace-pre-line">{data[`p${tab}`].txt}</p>
            <div className="mt-4 pt-2 border-t border-blue-200 text-[10px] text-blue-500 font-bold uppercase">
              TỪ KHÓA: {data[`p${tab}`].key}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}