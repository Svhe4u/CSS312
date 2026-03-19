# 🧪 SQA Login Test Suite — 2026

**Программ хангамжийн чанарын үнэлгээ** хичээлийн биедаалтын туршилтын код

---

## 📋 Агуулга

| Хавтас | Агуулга |
|--------|---------|
| `tests/selenium/` | Selenium WebDriver UI туршилт (TC-01 ~ TC-05) |
| `tests/jest/` | Jest нэгж туршилт — validation логик (TC-06 ~ TC-10) |
| `tests/postman/` | Postman API туршилтын collection |
| `bug-reports/` | Илэрсэн алдааны тайлан (BUG-001 ~ BUG-003) |
| `docs/` | Туршилтын үр дүн, дэлгэрэнгүй баримт |

---

## 🛠 Суулгах заавар

```bash
# 1. Репозитор татах
git clone https://github.com/[YOUR_USERNAME]/sqa-login-test-2026.git
cd sqa-login-test-2026

# 2. Хамаарлууд суулгах
npm install

# 3. Jest нэгж туршилт ажиллуулах
npm run test:jest

# 4. Selenium UI туршилт ажиллуулах (Chrome байх шаардлагатай)
npm run test:selenium
```

---

## ✅ Туршилтын Тохиолдлуудын Жагсаалт

### Selenium — Login (TC-01 ~ TC-05)
| TC-ID | Тохиолдол | Статус |
|-------|-----------|--------|
| TC-01 | Зөв нэвтрэх | ✅ PASS |
| TC-02 | Буруу нууц үг | ✅ PASS |
| TC-03 | Хоосон нэр | ✅ PASS |
| TC-04 | SQL Injection | ❌ FAIL |
| TC-05 | Account Lockout | ❌ FAIL |

### Jest — Register (TC-06 ~ TC-10)
| TC-ID | Тохиолдол | Статус |
|-------|-----------|--------|
| TC-06 | Зөв бүртгэл | ✅ PASS |
| TC-07 | Давхцсан email | ✅ PASS |
| TC-08 | Нууц үг богино | ✅ PASS |
| TC-09 | XSS оролт | ❌ FAIL |
| TC-10 | Email формат буруу | ✅ PASS |

---

## 🐛 Илэрсэн Алдаанууд

| Bug ID | Хүндийн зэрэг | Тайлбар | Статус |
|--------|---------------|---------|--------|
| BUG-001 | 🔴 CRITICAL | SQL Injection хамгаалалтгүй | OPEN |
| BUG-002 | 🟠 HIGH | XSS эмзэг байдал | OPEN |
| BUG-003 | 🟠 HIGH | Account lockout байхгүй | OPEN |

---

## 📐 Ашигласан Стандарт

- **ISO/IEC 25010:2011** — Чанарын загвар
- **TMMi Level 2** — Туршилтын процессын үнэлгээ
- **IEEE 829** — Туршилтын баримт бичгийн стандарт
- **OWASP Top 10:2021** — Аюулгүй байдлын шалгуур

---

## 📚 Ишлэл

1. Myers, G. J. et al. (2011). *The Art of Software Testing*, 3rd ed. — хуудас 45–62
2. ISO/IEC 25010:2011 — хуудас 1–15
3. Van Veenendaal, E. (2012). *The TMMi Professional* — хуудас 23–41
4. OWASP Top 10:2021 — A03, A07

---

*Багийн нэр: _________________ | Хамгаалах огноо: 2026.03.20*
