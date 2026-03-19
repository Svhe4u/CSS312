/**
 * Selenium WebDriver — Login Системийн UI Туршилт
 * TC-01 ~ TC-05 туршилтын тохиолдлуудыг хамарна
 *
 * Ашигласан стандарт: ISO/IEC 25010 — Functional Suitability, Security
 * Ишлэл: Myers, G.J. (2011). The Art of Software Testing, 3rd ed. — хуудас 45–62
 *
 * Ажиллуулах: node tests/selenium/login.test.js
 * Шаардлага: Chrome browser суулгасан байх
 */

const { Builder, By, until } = require("selenium-webdriver");

// ── Тохируулга ───────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000";
const TIMEOUT  = 5000; // ms

// Туршилтын үр дүнг хадгалах
const results = [];

function log(tcId, status, message) {
  const icon = status === "PASS" ? "✅" : "❌";
  const line = `${icon} ${tcId}: ${status} — ${message}`;
  console.log(line);
  results.push({ tcId, status, message });
}

// ── Туршилтын тохиолдлууд ────────────────────────────────────────────────

/**
 * TC-01: Зөв мэдээллээр нэвтрэх
 * Хүлээгдэх үр дүн: /dashboard хуудас руу шилжих
 */
async function tc01_validLogin(driver) {
  try {
    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("Admin@123");
    await driver.findElement(By.id("submit-btn")).click();
    await driver.wait(until.urlContains("/dashboard"), TIMEOUT);
    log("TC-01", "PASS", "Зөв нэвтрэлт амжилттай — /dashboard руу шилжсэн");
  } catch (e) {
    log("TC-01", "FAIL", `Нэвтрэлт амжилтгүй: ${e.message}`);
  }
}

/**
 * TC-02: Буруу нууц үгээр нэвтрэх
 * Хүлээгдэх үр дүн: "Нууц үг буруу байна" алдааны мессеж гарах
 */
async function tc02_wrongPassword(driver) {
  try {
    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("submit-btn")).click();

    const errorEl = await driver.wait(
      until.elementLocated(By.className("error-message")),
      TIMEOUT
    );
    const errorText = await errorEl.getText();

    if (errorText.includes("Нууц үг буруу") || errorText.includes("Invalid")) {
      log("TC-02", "PASS", `Алдааны мессеж зөв гарсан: "${errorText}"`);
    } else {
      log("TC-02", "FAIL", `Буруу мессеж: "${errorText}"`);
    }
  } catch (e) {
    log("TC-02", "FAIL", `Алдааны мессеж гарсангүй: ${e.message}`);
  }
}

/**
 * TC-03: Хоосон нэртэй нэвтрэх
 * Хүлээгдэх үр дүн: "Заавал бөглөх талбар" validation мессеж гарах
 */
async function tc03_emptyUsername(driver) {
  try {
    await driver.get(`${BASE_URL}/login`);
    // username хоосон орхих
    await driver.findElement(By.id("password")).sendKeys("Admin@123");
    await driver.findElement(By.id("submit-btn")).click();

    // HTML5 validation эсвэл custom validation шалгах
    const usernameField = await driver.findElement(By.id("username"));
    const validationMsg  = await driver.executeScript(
      "return arguments[0].validationMessage;",
      usernameField
    );

    if (validationMsg || await driver.findElements(By.className("error-message")).then(els => els.length > 0)) {
      log("TC-03", "PASS", "Хоосон нэрийн validation зөв ажилласан");
    } else {
      log("TC-03", "FAIL", "Validation мессеж гарсангүй");
    }
  } catch (e) {
    log("TC-03", "FAIL", `Тест алдаатай: ${e.message}`);
  }
}

/**
 * TC-04: SQL Injection оролдлого
 * Хүлээгдэх үр дүн: Нэвтрэх БОЛОМЖГҮЙ, аюулгүй байдлын алдаа буцаах
 * Ишлэл: OWASP Top 10:2021 — A03 Injection
 *
 * ⚠ АНХААРУУЛГА: Энэ туршилт FAIL өгч байна — систем эмзэг байна!
 */
async function tc04_sqlInjection(driver) {
  try {
    await driver.get(`${BASE_URL}/login`);
    // SQL Injection оролдлого
    await driver.findElement(By.id("username")).sendKeys("' OR '1'='1' --");
    await driver.findElement(By.id("password")).sendKeys("anything");
    await driver.findElement(By.id("submit-btn")).click();

    // 2 секунд хүлээх
    await driver.sleep(2000);
    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("/dashboard")) {
      // Системд нэвтэрч чадсан = АЮУЛ БАЙНА
      log("TC-04", "FAIL",
        "🚨 BUG-001: SQL Injection амжилттай — систем эмзэг байна! " +
        "Parameterized query ашиглах шаардлагатай."
      );
    } else {
      log("TC-04", "PASS", "SQL Injection блоклогдсон — систем хамгаалагдсан");
    }
  } catch (e) {
    log("TC-04", "FAIL", `Тест алдаатай: ${e.message}`);
  }
}

/**
 * TC-05: Account Lockout — олон удаа буруу нэвтрэх
 * Хүлээгдэх үр дүн: 5 удааны дараа account түр хаагдах
 * Ишлэл: OWASP Top 10:2021 — Brute Force хамгаалалт
 *
 * ⚠ АНХААРУУЛГА: Энэ туршилт FAIL өгч байна — lockout механизм байхгүй!
 */
async function tc05_accountLockout(driver) {
  try {
    await driver.get(`${BASE_URL}/login`);
    let lockedOut = false;

    // 6 удаа буруу нэвтрэх оролдлого
    for (let attempt = 1; attempt <= 6; attempt++) {
      await driver.findElement(By.id("username")).clear();
      await driver.findElement(By.id("password")).clear();
      await driver.findElement(By.id("username")).sendKeys("admin");
      await driver.findElement(By.id("password")).sendKeys(`wrongpass${attempt}`);
      await driver.findElement(By.id("submit-btn")).click();
      await driver.sleep(500);

      // Lockout мессеж шалгах
      const pageSource = await driver.getPageSource();
      if (
        pageSource.includes("locked") ||
        pageSource.includes("хаагдсан") ||
        pageSource.includes("Too many attempts")
      ) {
        lockedOut = true;
        log("TC-05", "PASS", `Account ${attempt}-р оролдлогод хаагдсан — Brute-force хамгаалагдсан`);
        break;
      }
    }

    if (!lockedOut) {
      log("TC-05", "FAIL",
        "🚨 BUG-003: 6 удаа буруу нэвтэрсэн ч account хаагдсангүй! " +
        "Rate limiting нэмэх шаардлагатай."
      );
    }
  } catch (e) {
    log("TC-05", "FAIL", `Тест алдаатай: ${e.message}`);
  }
}

// ── Үндсэн ажиллуулагч ───────────────────────────────────────────────────
async function runAllTests() {
  console.log("═".repeat(60));
  console.log("  🔬 SQA Login Selenium Test Suite — 2026");
  console.log("  ISO/IEC 25010 | OWASP Top 10 | IEEE 829");
  console.log("═".repeat(60));

  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();

    await tc01_validLogin(driver);
    await tc02_wrongPassword(driver);
    await tc03_emptyUsername(driver);
    await tc04_sqlInjection(driver);
    await tc05_accountLockout(driver);

  } finally {
    if (driver) await driver.quit();
  }

  // Үр дүнгийн хураангуй
  console.log("\n" + "─".repeat(60));
  console.log("  📊 ТУРШИЛТЫН ҮР ДҮНГИЙН ХУРААНГУЙ");
  console.log("─".repeat(60));
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  console.log(`  Нийт:  ${results.length}`);
  console.log(`  PASS:  ${passed} ✅`);
  console.log(`  FAIL:  ${failed} ❌`);
  console.log(`  Pass rate: ${Math.round((passed / results.length) * 100)}%`);
  console.log("─".repeat(60));

  if (failed > 0) {
    console.log("\n  ⚠ Доорх bug-уудыг яаралтай засах шаардлагатай:");
    results
      .filter(r => r.status === "FAIL")
      .forEach(r => console.log(`    • ${r.tcId}: ${r.message}`));
  }
}

runAllTests().catch(console.error);
