class Prompts:
    @staticmethod
    def cv_analysis(cv_text: str) -> str:
        return f"""Bạn là Senior HR Tech Lead với 15 năm kinh nghiệm phân tích CV ngành IT và Digital tại thị trường Việt Nam.

PHÂN TÍCH CV:
\"\"\"
{cv_text[:8000]}
\"\"\"

Trả về JSON hợp lệ theo định dạng:
{{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missing_skills": ["string"],
  "format_score": number,
  "suggestions": ["string"],
  "suitable_industries": ["string"],
  "suitable_level": "Fresher|Junior|Mid|Senior|Lead|Manager",
  "extracted_skills": ["string"],
  "experience_years": number,
  "career_trajectory": "string"
}}

Lưu ý:
- Đánh giá format dựa trên cấu trúc, độ dài, keywords, thành tựu định lượng
- Missing skills: liệt kê kỹ năng HOT hiện tại mà CV thiếu
- Trajectory: đánh giá quỹ đạo sự nghiệp (đang tăng trưởng/đi ngang/cần chuyển hướng)"""
    
    @staticmethod
    def job_suggestion(cv_analysis: dict, jobs_context: str) -> str:
        return f"""Dựa trên phân tích CV và danh sách việc làm từ database:

PHÂN TÍCH CV:
- Ngành phù hợp: {', '.join(cv_analysis.get('suitable_industries', []))}
- Cấp bậc: {cv_analysis.get('suitable_level', 'Unknown')}
- Kỹ năng: {', '.join(cv_analysis.get('extracted_skills', []))}
- Kinh nghiệm: {cv_analysis.get('experience_years', 0)} năm

JOBS DATABASE:
{jobs_context}

Đề xuất top 5 vị trí phù hợp nhất. Trả về JSON array."""
    
    @staticmethod
    def salary_qa(context: str, question: str) -> str:
        return f"""Bạn là chuyên gia compensation & benefits tại Việt Nam.

DỮ LIỆU THAM KHẢO:
{context}

CÂU HỎI: {question}

Trả lời với range lương cụ thể (triệu VND/tháng hoặc USD/năm), phân biệt product vs outsourcing."""
    
    @staticmethod
    def trend_qa(context: str, question: str) -> str:
        return f"""DỮ LIỆU XU HƯỚNG THỊ TRƯỜNG:
{context}

CÂU HỎI: {question}

Trả lời ngắn gọn, có số liệu cụ thể, đề cập nhu cầu tuyển dụng và dự báo."""
    
    @staticmethod
    def intent_classification(query: str) -> str:
        return f"""Phân loại intent của câu hỏi thành 1 trong các loại:
- cv_analysis: Phân tích, đánh giá, góp ý CV
- job_suggestion: Tìm việc, đề xuất công việc phù hợp
- salary_query: Hỏi về mức lương, thưởng, đãi ngộ
- trend_query: Xu hướng thị trường lao động, ngành nghề HOT
- interview_prep: Chuẩn bị phỏng vấn, câu hỏi phỏng vấn
- career_advice: Tư vấn chuyển ngành, lộ trình sự nghiệp
- general: Câu hỏi chung

Câu hỏi: "{query}"

Chỉ trả về tên intent, không giải thích."""
    
    @staticmethod
    def rag_answer(context: str, history: str, question: str) -> str:
        return f"""Bạn là Career Advisor AI thông minh, chuyên hỗ trợ người tìm việc tại Việt Nam.

LỊCH SỬ TRÒ CHUYỆN:
{history}

NGỮ CẢNH TỪ DATABASE:
{context}

CÂU HỎI HIỆN TẠI: {question}

HƯỚNG DẪN:
1. Trả lời dựa trên ngữ cảnh được cung cấp
2. Nếu ngữ cảnh không đủ, dùng kiến thức chung nhưng ghi rõ "Theo kinh nghiệm chung"
3. Trả lời tự nhiên, có cấu trúc rõ ràng
4. Luôn khuyến khích và mang tính xây dựng

Trả lời:"""