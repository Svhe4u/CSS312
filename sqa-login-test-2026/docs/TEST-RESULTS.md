# 📊 Туршилтын Үр Дүн — Test Results

**Огноо:** 2026.03.18  
**Туршилтын систем:** Login Module v1.0  
**Ашигласан стандарт:** ISO/IEC 25010, TMMi Level 2, IEEE 829

---

## Нэгдсэн Үр Дүн

| Үзүүлэлт | Утга |
|-----------|------|
| Нийт туршилтын тохиолдол | 10 |
| ✅ PASS | 7 (70%) |
| ❌ FAIL | 3 (30%) |
| 🐛 Bug илэрсэн | 3 |
| CRITICAL bug | 1 |
| HIGH bug | 2 |

---

## Нарийвчилсан Үр Дүн

| TC-ID | Тохиолдол | Хэрэгсэл | Үр дүн | Bug |
|-------|-----------|----------|--------|-----|
| TC-01 | Зөв нэвтрэх | Selenium | ✅ PASS | — |
| TC-02 | Буруу нууц үг | Selenium | ✅ PASS | — |
| TC-03 | Хоосон нэр | Selenium | ✅ PASS | — |
| TC-04 | SQL Injection | Selenium + Postman | ❌ FAIL | BUG-001 |
| TC-05 | Account Lockout | Selenium | ❌ FAIL | BUG-003 |
| TC-06 | Зөв бүртгэл | Jest | ✅ PASS | — |
| TC-07 | Давхцсан email | Jest | ✅ PASS | — |
| TC-08 | Нууц үг богино | Jest | ✅ PASS | — |
| TC-09 | XSS оролт | Jest + OWASP ZAP | ❌ FAIL | BUG-002 |
| TC-10 | Email формат | Jest | ✅ PASS | — |

---

## ISO/IEC 25010 Үнэлгээ

| Шинж чанар | Хэмжүүр | Утга | Дүгнэлт |
|------------|---------|------|---------|
| Functional Suitability | Pass rate | 70% | ⚠ Хангалттай биш |
| Security | SQL/XSS/Brute | 0/3 | ❌ Яаралтай засах |
| Reliability | Uptime | 99.7% | ✅ Өндөр |
| Performance | Avg response | 187ms | ✅ Зорилтод |
| Usability | Task completion | 82% | ✅ Хангалттай |

---

## TMMi Үнэлгээ

**Одоогийн түвшин: Level 2 — Managed**

- ✅ Test Plan боловсруулсан
- ✅ Test Cases баримтжуулсан
- ✅ Туршилтын орчин тохируулсан
- ❌ Туршилт SDLC-д бүрэн интегрчлэгдээгүй (Level 3 шаардлага)
