import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { monHoc, imageBase64 } = await req.json();
    
    // Khởi tạo Gemini với Key từ môi trường Cloudflare
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Bạn là hệ sinh thái học tập thông minh. Đề bài thuộc môn: ${monHoc}.
      Nhiệm vụ: Phân tích ảnh và đóng vai 3 Professor trả về JSON chuẩn:
      {
        "p1": {"txt": "Đáp án ngắn gọn và chính xác nhất.", "key": "Chốt đáp án là..."},
        "p2": {"txt": "Giải thích chi tiết từng bước làm bài.", "key": "Mấu chốt nằm ở bước..."},
        "p3": {"txt": "Tạo 2 câu hỏi trắc nghiệm tương tự kèm đáp án.", "key": "Từ khóa luyện tập là..."}
      }
      Lưu ý: Phần 'key' chỉ chứa từ khóa hoặc ý chính để loa đọc thật ngắn gọn.
    `;

    // Chuyển Base64 sang định dạng Gemini hiểu được
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } }
    ]);

    const responseText = result.response.text();
    return NextResponse.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Lỗi AI:", error);
    return NextResponse.json({ error: "Hệ thống bận, thử lại sau" }, { status: 500 });
  }
}