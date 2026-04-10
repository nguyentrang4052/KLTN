"""
cleaner.py
─────────────────────────────────────────────────────────────
MỤC ĐÍCH: Chuẩn hoá dữ liệu thô từ 3 crawler về 1 format
          thống nhất khớp với Prisma schema.

VẤN ĐỀ CỐT LÕI:
  3 crawler trả về dữ liệu với format khác nhau:
  - CareerViet: postedAt = "24/03/2025", salary = "15 - 20 triệu"
  - TopCV:      postedAt = "2025-03-24",  salary = "Thoả thuận"
  - CareerLink: postedAt = "24-03-2025",  salary = "1000 - 2000 USD"

  PostgreSQL cần DateTime cho postedAt/deadline, String cho salary.
  Cleaner là lớp dịch thuật ngăn cách crawler với DB.

NGUYÊN LÝ:
  Không bao giờ throw exception — nếu 1 field lỗi thì
  trả về None cho field đó, các field khác vẫn lưu bình thường.
  Mất 1 field còn hơn mất cả job.
─────────────────────────────────────────────────────────────
"""
import re
import hashlib
from datetime import datetime, timedelta
from typing import Optional


# ─────────────────────────────────────────────────────────────
# PARSE DATE
# ─────────────────────────────────────────────────────────────

# Tất cả format ngày từ 3 website
_DATE_FORMATS = [
    "%d/%m/%Y",   # CareerViet: 24/03/2025
    "%d-%m-%Y",   # CareerLink: 24-03-2025
    "%Y-%m-%d",   # TopCV ISO: 2025-03-24
    "%d/%m/%y",   # Short year: 24/03/25
    "%d.%m.%Y",   # Dot format: 24.03.2025
]

# Map tháng tiếng Việt → số
_MONTH_VI = {
    "tháng 1": "01", "tháng 2": "02", "tháng 3": "03",
    "tháng 4": "04", "tháng 5": "05", "tháng 6": "06",
    "tháng 7": "07", "tháng 8": "08", "tháng 9": "09",
    "tháng 10": "10", "tháng 11": "11", "tháng 12": "12",
    "jan": "01", "feb": "02", "mar": "03", "apr": "04",
    "may": "05", "jun": "06", "jul": "07", "aug": "08",
    "sep": "09", "oct": "10", "nov": "11", "dec": "12",
}


def parse_date(s: Optional[str]) -> Optional[datetime]:
    """
    Parse chuỗi ngày từ nhiều format khác nhau về datetime.

    Xử lý thêm các trường hợp đặc biệt:
    - "còn 15 ngày" → tính từ ngày hôm nay + 15 ngày (CareerLink deadline)
    - "24 tháng 3, 2025" → dịch tháng tiếng Việt trước khi parse
    - Chỉ có năm-tháng "03/2025" → gán ngày 1
    """
    if not s:
        return None

    s = s.strip()

    # Trường hợp CareerLink: "còn 15 ngày" / "còn 30 ngày nữa"
    remaining = re.search(r"còn\s+(\d+)\s+ngày", s, re.IGNORECASE)
    if remaining:
        return datetime.now() + timedelta(days=int(remaining.group(1)))

    # Trường hợp "X ngày trước" → tính ngày đăng
    days_ago = re.search(r"(\d+)\s+ngày\s+trước", s, re.IGNORECASE)
    if days_ago:
        return datetime.now() - timedelta(days=int(days_ago.group(1)))

    # Dịch tháng tiếng Việt
    s_lower = s.lower()
    for vi, num in _MONTH_VI.items():
        if vi in s_lower:
            s = re.sub(vi, num, s, flags=re.IGNORECASE)
            break

    # Chuẩn hoá separator: "24 03 2025" → "24/03/2025"
    s = re.sub(r"[\s,]+", "/", s.strip())
    # Xoá chữ thừa: "Ngày 24/03/2025" → "24/03/2025"
    s = re.sub(r"[^\d/\-\.]", "", s).strip("/").strip("-")

    # Thử từng format
    for fmt in _DATE_FORMATS:
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue

    # Fallback: tìm pattern dd/mm/yyyy hoặc yyyy-mm-dd trong chuỗi phức tạp
    m = re.search(r"(\d{4})[/-](\d{1,2})[/-](\d{1,2})", s)
    if m:
        try:
            return datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except ValueError:
            pass

    m = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", s)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass

    print(f"[CLEANER] Không parse được ngày: '{s}'")
    return None


# ─────────────────────────────────────────────────────────────
# CLEAN TEXT
# ─────────────────────────────────────────────────────────────

def clean_text(s: Optional[str]) -> Optional[str]:
    """
    Chuẩn hoá text thô từ crawler:
    - Xoá whitespace thừa (tab, newline, double space)
    - Xoá ký tự điều khiển ẩn (thường xuất hiện khi copy từ web)
    - Trả về None nếu chuỗi rỗng sau clean (tránh lưu "" vào DB)
    """
    if not s:
        return None
    # Xoá ký tự điều khiển ẩn (U+200B zero-width space, U+00A0 non-breaking space...)
    s = re.sub(r"[\u200b\u00a0\u200c\u200d\ufeff]", " ", s)
    # Chuẩn hoá whitespace
    s = re.sub(r"[ \t]+", " ", s)          # nhiều space/tab → 1 space
    s = re.sub(r"\n{3,}", "\n\n", s)       # nhiều dòng trống → tối đa 2
    s = s.strip()
    return s if s else None


def clean_salary(s: Optional[str]) -> Optional[str]:
    """
    Chuẩn hoá salary về dạng nhất quán.

    Các format phổ biến:
    - "15,000,000 - 20,000,000 VNĐ"  → "15 - 20 triệu VNĐ"
    - "1000 - 2000 USD"               → giữ nguyên
    - "Thoả thuận" / "Thương lượng"   → "Thoả thuận"
    - "$1000 - $2000"                  → "1000 - 2000 USD"

    Lý do không convert về số:
    DB lưu String cho salary vì:
    1. Đơn vị khác nhau (VNĐ, USD, triệu...)
    2. "Thoả thuận" không có giá trị số
    3. Frontend hiển thị dạng text
    """
    if not s:
        return None
    s = clean_text(s)
    if not s:
        return None

    # Chuẩn hoá "Thoả thuận" các dạng
    if re.search(r"thoa.thuan|thuong.luong|negotiate|competitive", s, re.IGNORECASE):
        return "Thoả thuận"

    # Convert "15,000,000" → "15 triệu" (chỉ khi đơn vị là VNĐ/đồng)
    if re.search(r"vnđ|vnd|đồng", s, re.IGNORECASE):
        def to_million(m):
            val = int(m.group().replace(",", "").replace(".", ""))
            if val >= 1_000_000:
                return f"{val // 1_000_000}"
            return m.group()
        s = re.sub(r"\d[\d,\.]+", to_million, s)
        s = re.sub(r"vnđ|vnd|đồng", "triệu VNĐ", s, flags=re.IGNORECASE)

    return clean_text(s)


def clean_experience(s: Optional[str]) -> Optional[str]:
    """
    Chuẩn hoá kinh nghiệm về dạng nhất quán.
    "Không yêu cầu kinh nghiệm" / "Fresher" / "0 năm" → "Không yêu cầu"
    "Từ 1 đến 2 năm" / "1-2 years" → "1 - 2 năm"
    """
    if not s:
        return None
    s = clean_text(s)
    if not s:
        return None

    if re.search(r"không yêu cầu|fresher|chưa có|0 năm|không cần", s, re.IGNORECASE):
        return "Không yêu cầu"

    # Chuẩn hoá "years" → "năm"
    s = re.sub(r"\byears?\b", "năm", s, flags=re.IGNORECASE)
    return s


# ─────────────────────────────────────────────────────────────
# MAIN CLEAN FUNCTION
# ─────────────────────────────────────────────────────────────

# def clean_job(raw: dict) -> dict:
#     """
#     Hàm chính — nhận raw dict từ bất kỳ crawler nào,
#     trả về dict sạch khớp với Prisma Job + Company schema.

#     Raw format (chuẩn từ cả 3 crawler):
#     {
#         "industry": "Công nghệ thông tin",
#         "job": {
#             title, shortLocation, location, salary,
#             description, requirement, benefit, other,
#             jobType, workingTime, experienceYear,
#             postedAt, deadline, sourcePlatform, sourceLink
#         },
#         "company": {
#             companyName, companyWebsite, address,
#             companyLogo, companySize, companyProfile
#         }
#     }
#     """
#     j = raw.get("job", {})
#     c = raw.get("company", {})

#     return {
#         "industry": clean_text(raw.get("industry")),

#         "job": {
#             "title":          clean_text(j.get("title")),
#             "shortLocation":  clean_text(j.get("shortLocation")),
#             "location":       clean_text(j.get("location")),
#             "salary":         clean_salary(j.get("salary")),
#             "description":    clean_text(j.get("description")),
#             "requirement":    clean_text(j.get("requirement")),
#             "benefit":        clean_text(j.get("benefit")),
#             "other":          clean_text(j.get("other")),
#             "jobType":        clean_text(j.get("jobType")),
#             "workingTime":    clean_text(j.get("workingTime")),
#             "experienceYear": clean_experience(j.get("experienceYear")),
#             # parse_date trả về datetime object — psycopg2 tự convert sang PostgreSQL TIMESTAMP
#             "postedAt":       parse_date(j.get("postedAt")),
#             "deadline":       parse_date(j.get("deadline")),
#             "sourcePlatform": clean_text(j.get("sourcePlatform")),
#             "sourceLink":     clean_text(j.get("sourceLink")),
#         },

#         "company": {
#             # companyName không được None vì là UNIQUE key để upsert
#             "companyName":    clean_text(c.get("companyName")) or "Không rõ",
#             "companyWebsite": clean_text(c.get("companyWebsite")),
#             "address":        clean_text(c.get("address")),
#             "companyLogo":    clean_text(c.get("companyLogo")),
#             "companySize":    clean_text(c.get("companySize")),
#             "companyProfile": clean_text(c.get("companyProfile")),
#         },
#     }





def clean_job(raw: dict) -> dict:
    j = raw.get("job", {})
    c = raw.get("company", {})

    cleaned = {
        "industry": clean_text(raw.get("industry")),
        "job": {
            "title": clean_text(j.get("title")),
            "shortLocation": clean_text(j.get("shortLocation")),
            "location": clean_text(j.get("location")),
            "salary": clean_salary(j.get("salary")),
            "description": clean_text(j.get("description")),
            "requirement": clean_text(j.get("requirement")),
            "benefit": clean_text(j.get("benefit")),
            "other": clean_text(j.get("other")),
            "jobType": clean_text(j.get("jobType")),
            "workingTime": clean_text(j.get("workingTime")),
            "experienceYear": clean_experience(j.get("experienceYear")),
            "postedAt": parse_date(j.get("postedAt")),
            "deadline": parse_date(j.get("deadline")),
            "sourcePlatform": clean_text(j.get("sourcePlatform")),
            "sourceLink": clean_text(j.get("sourceLink")),
        },
        "company": {
            "companyName": clean_text(c.get("companyName")) or "Không rõ",
            "companyWebsite": clean_text(c.get("companyWebsite")),
            "address": clean_text(c.get("address")),
            "companyLogo": clean_text(c.get("companyLogo")),
            "companySize": clean_text(c.get("companySize")),
            "companyProfile": clean_text(c.get("companyProfile")),
        },
    }
    
    # ✅ Giữ lại các metadata từ orchestrator (không nằm trong job/company)
    if "isNewJob" in raw:
        cleaned["isNewJob"] = raw["isNewJob"]
    if "industrySourcePlatform" in raw:
        cleaned["industrySourcePlatform"] = raw["industrySourcePlatform"]
    if "skills" in raw:
        cleaned["skills"] = raw["skills"]
        
    return cleaned