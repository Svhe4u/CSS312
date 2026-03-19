# 🐛 Алдааны Тайлан (Bug Reports)

> **Туршилтын систем:** Login Module — Node.js + SQLite  
> **Туршилтын хугацаа:** 2026.03.10 – 2026.03.18  
> **Ашигласан хэрэгсэл:** Selenium WebDriver, OWASP ZAP, Postman  
> **Ишлэл:** OWASP Top 10:2021, ISO/IEC 25010:2011

---

## BUG-001 — 🔴 CRITICAL: SQL Injection Эмзэг Байдал

| Талбар | Утга |
|--------|------|
| **Bug ID** | BUG-001 |
| **Гарчиг** | Login форм — SQL Injection хамгаалалтгүй |
| **Нээсэн огноо** | 2026.03.14 |
| **Нэвтрүүлэгч** | TC-04 (Selenium), Postman |
| **Хэсэг** | `POST /api/login` endpoint |
| **Хүндийн зэрэг** | 🔴 CRITICAL |
| **Эрэмбэ** | P1 — Яаралтай |
| **Статус** | OPEN |

### Нөхцөл (Steps to Reproduce)

```
1. http://localhost:3000/login руу очих
2. Username: ' OR '1'='1' --
3. Password: anything
4. Submit дарах
```

### Үр дүн

- **Одоогийн:** Системд нэвтэрч чадна ✗
- **Хүлээгдэх:** 401 Unauthorized буцаах ✓

### Үндсэн шалтгаан

```javascript
// ❌ БУРУУ — SQL Injection-д өртөмтгий
const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
```

### Засах арга

```javascript
// ✅ ЗӨВ — Parameterized query
const query = "SELECT * FROM users WHERE username=? AND password=?";
db.get(query, [username, password], callback);
```

**Стандарт:** OWASP Top 10:2021 — A03:2021 Injection

---

## BUG-002 — 🟠 HIGH: XSS (Cross-Site Scripting) Эмзэг Байдал

| Талбар | Утга |
|--------|------|
| **Bug ID** | BUG-002 |
| **Гарчиг** | Register форм — XSS script tag цэвэрлэгддэггүй |
| **Нээсэн огноо** | 2026.03.15 |
| **Нэвтрүүлэгч** | TC-09 (Jest), OWASP ZAP |
| **Хэсэг** | `POST /api/register` — username талбар |
| **Хүндийн зэрэг** | 🟠 HIGH |
| **Эрэмбэ** | P2 |
| **Статус** | OPEN |

### Нөхцөл (Steps to Reproduce)

```
1. http://localhost:3000/register руу очих
2. Username: <script>alert('XSS Attack!')</script>
3. Email: test@example.com
4. Password: ValidPass1
5. Submit дарах → Alert цонх гарч ирнэ
```

### OWASP ZAP скан үр дүн

```
[HIGH] Cross-site Scripting (Reflected)
URL: http://localhost:3000/register
Parameter: username
Evidence: <script>alert('XSS Attack!')</script>
```

### Засах арга

```javascript
// ✅ ЗӨВ — Input sanitization
const DOMPurify = require("isomorphic-dompurify");
const cleanUsername = DOMPurify.sanitize(username);

// Эсвэл энгийн regex
const cleanInput = input.replace(/[<>'"]/g, "");

// Content Security Policy тохируулах (helmet.js)
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"] }
}));
```

**Стандарт:** OWASP Top 10:2021 — A07:2021 XSS

---

## BUG-003 — 🟠 HIGH: Account Lockout Механизм Байхгүй

| Талбар | Утга |
|--------|------|
| **Bug ID** | BUG-003 |
| **Гарчиг** | Олон удаа буруу нэвтэрсэн ч блоклогддоггүй |
| **Нээсэн огноо** | 2026.03.16 |
| **Нэвтрүүлэгч** | TC-05 (Selenium), Postman Runner |
| **Хэсэг** | `POST /api/login` — rate limiting байхгүй |
| **Хүндийн зэрэг** | 🟠 HIGH |
| **Эрэмбэ** | P2 |
| **Статус** | OPEN |

### Нөхцөл (Steps to Reproduce)

```
1. Postman Collection Runner ашиглах
2. POST /api/login — буруу нэвтрэлтийг 100 удаа давтах
3. Бүх хүсэлт 401 буцаадаг — хэзээ ч 429 (Too Many Requests) болдоггүй
```

### Засах арга

```javascript
// ✅ ЗӨВ — express-rate-limit ашиглах
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,                    // 5 оролдлого
  message: { error: "Олон удаа оролдсон. 15 минутын дараа дахин оролдоно уу." }
});

app.post("/api/login", loginLimiter, loginHandler);
```

**Стандарт:** OWASP Top 10:2021 — A07 (Brute Force), ISO/IEC 25010 — Security

---

## 📊 Bug-ийн Хураангуй

| Bug ID | Хүндийн зэрэг | Эрэмбэ | Статус | Туршилтын тохиолдол |
|--------|---------------|--------|--------|---------------------|
| BUG-001 | 🔴 CRITICAL | P1 | OPEN | TC-04 |
| BUG-002 | 🟠 HIGH | P2 | OPEN | TC-09 |
| BUG-003 | 🟠 HIGH | P2 | OPEN | TC-05 |

> **Дүгнэлт:** 3 bug илэрсэн — бүгд аюулгүй байдалтай холбоотой.  
> SQL Injection (BUG-001) яаралтай засах шаардлагатай.
