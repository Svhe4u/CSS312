/**
 * Jest Нэгж Туршилт — Register/Validation Логикийн Туршилт
 * TC-06 ~ TC-10 туршилтын тохиолдлуудыг хамарна
 *
 * Ашигласан стандарт: ISO/IEC 25010 — Functional Suitability, Security
 * Ишлэл: Myers, G.J. (2011). The Art of Software Testing, 3rd ed. — хуудас 89–104
 *
 * Ажиллуулах: npm run test:jest
 */

// ── Туршиж буй validation функцууд ──────────────────────────────────────
// (Бодит системд src/validators.js файлаас импортлоно)

/**
 * Email формат шалгах
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
function validateEmail(email) {
  if (!email || email.trim() === "") {
    return { valid: false, message: "Email заавал бөглөх шаардлагатай" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Email формат буруу байна" };
  }
  return { valid: true, message: "OK" };
}

/**
 * Нууц үг хүч чадал шалгах
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Нууц үгт хамгийн багадаа 1 том үсэг байх ёстой" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Нууц үгт хамгийн багадаа 1 тоо байх ёстой" };
  }
  return { valid: true, message: "OK" };
}

/**
 * XSS оролтыг цэвэрлэх (sanitize)
 * АНХААРУУЛГА: Одоогийн хувилбарт XSS хамгаалалт БАЙХГҮЙ — BUG-002
 * @param {string} input
 * @returns {string} цэвэрлэгдсэн утга
 */
function sanitizeInput(input) {
  if (!input) return "";
  // ⚠ BUG-002: Одоогоор зөвхөн тайлбар — бодит sanitize хийгдэхгүй байна
  // Засвар: return input.replace(/[<>'"]/g, ""); эсвэл DOMPurify ашиглах
  return input; // Засагдаагүй хувилбар — FAIL өгнө
}

/**
 * Зөвхөн туршилтын зорилгоор: mock database шалгах
 * Бодит системд DB хүсэлт явуулна
 */
const mockExistingUsers = ["test@example.com", "admin@test.com", "user@mail.com"];

function checkEmailExists(email) {
  return mockExistingUsers.includes(email.toLowerCase());
}

/**
 * Бүртгэлийн бүрэн шалгалт
 */
function registerValidation(username, email, password) {
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) return emailCheck;

  const passCheck = validatePassword(password);
  if (!passCheck.valid) return passCheck;

  if (!username || username.trim().length < 3) {
    return { valid: false, message: "Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байх ёстой" };
  }

  if (checkEmailExists(email)) {
    return { valid: false, message: "Энэ email хаяг бүртгэлтэй байна" };
  }

  return { valid: true, message: "Бүртгэл амжилттай" };
}

// ════════════════════════════════════════════════════════════
// TC-06 ~ TC-10 ТУРШИЛТЫН ТОХИОЛДЛУУД
// ════════════════════════════════════════════════════════════

describe("📋 Register & Validation — Функциональ Туршилт", () => {

  // ── TC-06: Зөв бүртгэл ─────────────────────────────────────────────────
  describe("TC-06: Зөв мэдээллээр бүртгэх", () => {
    test("Бүх талбар зөв бол бүртгэл амжилттай байх ёстой", () => {
      const result = registerValidation(
        "newuser",
        "newuser@example.com",
        "SecurePass1"
      );
      expect(result.valid).toBe(true);
      expect(result.message).toBe("Бүртгэл амжилттай");
    });

    test("Зөв email формат хүлээн авах ёстой", () => {
      expect(validateEmail("user@domain.com").valid).toBe(true);
      expect(validateEmail("test.name@sub.domain.org").valid).toBe(true);
    });
  });

  // ── TC-07: Давхцсан email ───────────────────────────────────────────────
  describe("TC-07: Аль хэдийн бүртгэлтэй email ашиглах", () => {
    test("Байгаа email-ийг ашиглахад алдааны мессеж гарах ёстой", () => {
      const result = registerValidation(
        "someuser",
        "admin@test.com",   // mock DB-д байгаа email
        "ValidPass1"
      );
      expect(result.valid).toBe(false);
      expect(result.message).toContain("бүртгэлтэй байна");
    });

    test("checkEmailExists функц давхцалыг зөв тодорхойлох ёстой", () => {
      expect(checkEmailExists("test@example.com")).toBe(true);
      expect(checkEmailExists("new@example.com")).toBe(false);
    });
  });

  // ── TC-08: Богино нууц үг ───────────────────────────────────────────────
  describe("TC-08: 8-аас богино нууц үг", () => {
    test("7 тэмдэгтийн нууц үг татгалзах ёстой", () => {
      const result = validatePassword("Pass12");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("8 тэмдэгт");
    });

    test("Хоосон нууц үг татгалзах ёстой", () => {
      expect(validatePassword("").valid).toBe(false);
      expect(validatePassword(null).valid).toBe(false);
    });

    test("8 болон түүнээс дээш тэмдэгтийн нууц үг зөвшөөрөх ёстой", () => {
      expect(validatePassword("ValidPass1").valid).toBe(true);
      expect(validatePassword("LongSecure123").valid).toBe(true);
    });

    test("Том үсэггүй нууц үг татгалзах ёстой", () => {
      const result = validatePassword("lowercase1");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("том үсэг");
    });

    test("Тоогүй нууц үг татгалзах ёстой", () => {
      const result = validatePassword("NoNumbers!");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("тоо");
    });
  });

  // ── TC-09: XSS оролт ────────────────────────────────────────────────────
  describe("TC-09: XSS (Cross-Site Scripting) хамгаалалт", () => {
    /**
     * ⚠ АНХААРУУЛГА: Энэ туршилт FAIL өгнө
     * BUG-002: sanitizeInput() функц одоогоор XSS цэвэрлэдэггүй
     * Засвар: DOMPurify эсвэл input.replace(/[<>'"]/g, "") ашиглах
     * Ишлэл: OWASP Top 10:2021 — A07 XSS хуудас 1–3
     */
    test("Script tag оролтыг устгах ёстой — BUG-002 шалгалт", () => {
      const maliciousInput = "<script>alert('XSS Attack!')</script>";
      const cleaned = sanitizeInput(maliciousInput);

      // Энэ test одоогоор FAIL өгнө — sanitize хийгдэхгүй байгаа учраас
      expect(cleaned).not.toContain("<script>");
      expect(cleaned).not.toContain("</script>");
    });

    test("HTML tag оролтыг цэвэрлэх ёстой", () => {
      const htmlInput = '<img src="x" onerror="alert(1)">';
      const cleaned = sanitizeInput(htmlInput);
      // FAIL өгнө — BUG-002
      expect(cleaned).not.toContain("<img");
    });

    test("Энгийн текст оролт өөрчлөгдөхгүй байх ёстой", () => {
      // Энэ нэг л тест PASS өгнө
      const safeInput = "John Doe";
      const cleaned = sanitizeInput(safeInput);
      expect(cleaned).toBe("John Doe");
    });
  });

  // ── TC-10: Email формат шалгалт ─────────────────────────────────────────
  describe("TC-10: Email формат баталгаажуулалт", () => {
    test("Буруу email формат татгалзах ёстой", () => {
      expect(validateEmail("test@invalid").valid).toBe(false);
      expect(validateEmail("notanemail").valid).toBe(false);
      expect(validateEmail("@domain.com").valid).toBe(false);
      expect(validateEmail("user@.com").valid).toBe(false);
    });

    test("Хоосон email татгалзах ёстой", () => {
      expect(validateEmail("").valid).toBe(false);
      expect(validateEmail(null).valid).toBe(false);
    });

    test("Буруу email алдааны мессеж буцаах ёстой", () => {
      const result = validateEmail("wrongformat");
      expect(result.message).toContain("формат буруу");
    });
  });

});

// ── Нэмэлт: Усability шалгалт (ISO/IEC 25010) ────────────────────────────
describe("📐 ISO/IEC 25010 — Usability Шалгалт", () => {
  test("Validation мессежүүд монгол хэлэнд байх ёстой", () => {
    // Learnability — хэрэглэгч алдааг ойлгох чадвар
    const emailError  = validateEmail("bad-email").message;
    const passError   = validatePassword("weak").message;
    expect(emailError).toMatch(/[А-Яа-яӨөҮүЭэ]/); // Кирилл тэмдэгт байгаа эсэх
    expect(passError).toMatch(/[А-Яа-яӨөҮүЭэ]/);
  });

  test("Validation мессежүүд тодорхой, ойлгомжтой байх ёстой", () => {
    // Operability — хэрэглэгч ямар засвар хийх мэдэх ёстой
    const result = validatePassword("short");
    expect(result.message.length).toBeGreaterThan(10); // Богино мессеж биш
    expect(result.message).not.toBe("Error");          // Тодорхой бус биш
  });
});
