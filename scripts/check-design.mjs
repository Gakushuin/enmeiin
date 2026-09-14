import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const baseline = "63048a645135e032aa0359c198c2c15292e64eba";
const oldHtml = execFileSync("git", ["show", baseline + ":index.html"], { encoding: "utf8" });
const html = await readFile("index.html", "utf8");
assert.equal(html.slice(html.indexOf("<body")), oldHtml.slice(oldHtml.indexOf("<body")), "All body markup must remain identical");
const jsonLd = source => source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
assert.equal(jsonLd(html), jsonLd(oldHtml), "Structured data must remain identical");
const changed = execFileSync("git", ["diff", "--name-only", baseline, "HEAD"], { encoding: "utf8" }).trim().split("\n");
assert.ok(changed.every(path => !path.startsWith("assets/")), "Photo files must remain identical");
console.log("PRESERVATION PASS: exact body markup, structured data, and all photographs");

const root = process.cwd();
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + "/")) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" }).end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolveReady => server.listen(4173, "127.0.0.1", resolveReady));
const browser = await chromium.launch();
const url = "http://127.0.0.1:4173/";
await mkdir("design-review", { recursive: true });
const results = [];
async function screenshot(page, label, locator) {
  const data = locator ? await locator.screenshot({ type: "jpeg", quality: 63 }) : await page.screenshot({ type: "jpeg", quality: 65 });
  await writeFile("design-review/" + label + ".jpg", data);
  const encoded = data.toString("base64");
  console.log("SCREENSHOT_BEGIN " + label);
  for (let i = 0; i < encoded.length; i += 12000) console.log("SCREENSHOT_CHUNK " + encoded.slice(i, i + 12000));
  console.log("SCREENSHOT_END " + label);
}
async function prepareContext(options) {
  const context = await browser.newContext({ locale: "ja-JP", ...options });
  // Isolate the local layout check from Google's third-party map response.
  await context.route("https://maps.google.com/**", route => route.fulfill({ contentType: "text/html", body: "<html><body style='background:#e9ede3'></body></html>" }));
  return context;
}
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await prepareContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) {
        img.loading = "eager";
        await img.decode();
      }
    });
    const measurements = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const overflows = Array.from(document.querySelectorAll("main *, footer *")).filter(element => {
        if (element.classList.contains("sr-only")) return false;
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return box.width && style.display !== "none" && (box.left < -1 || box.right > width + 1);
      }).map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right }));
      return {
        viewport: width,
        documentWidth: document.documentElement.scrollWidth,
        overflows,
        photos: Array.from(document.images).map(img => ({ src: img.getAttribute("src"), loaded: img.complete && img.naturalWidth > 0 })),
        headings: Array.from(document.querySelectorAll("h1,h2")).map(node => ({ text: node.textContent, height: node.getBoundingClientRect().height })),
        reducedMotionAnimations: document.getAnimations().length,
        pageHeight: document.documentElement.scrollHeight
      };
    });
    console.log("LAYOUT " + JSON.stringify(measurements));
    assert.ok(measurements.documentWidth <= width + 1, "Document horizontal overflow at " + width);
    assert.deepEqual(measurements.overflows, [], "Content outside viewport at " + width);
    assert.equal(measurements.photos.length, 6);
    assert.ok(measurements.photos.every(photo => photo.loaded));
    assert.ok(measurements.headings.every(heading => heading.height > 0));
    assert.equal(measurements.reducedMotionAnimations, 0);
    const faq = page.locator(".faq-list details").first();
    await faq.locator("summary").click();
    assert.equal(await faq.getAttribute("open"), "");
    assert.equal(await faq.locator("p").isVisible(), true);
    await faq.locator("summary").click();
    assert.equal(await faq.getAttribute("open"), null);
    if (width <= 760) {
      await page.locator(".mobile-actions a[href='#access']").click();
      assert.ok(page.url().endsWith("#access"));
      const position = await page.locator("#access").boundingBox();
      assert.ok(position.y >= -1 && position.y < 100, "Mobile access anchor is visible");
      const actions = await page.locator(".mobile-actions a").evaluateAll(links => links.map(link => ({ href: link.getAttribute("href"), height: link.getBoundingClientRect().height })));
      assert.ok(actions.every(link => link.height >= 44));
      assert.ok(actions.some(link => link.href === "tel:0338417122"));
      assert.ok(actions.some(link => link.href === "mailto:enmeiin51@gmail.com"));
    }
    assert.deepEqual(errors, []);
    await page.goto(url, { waitUntil: "load" });
    if (width === 1440) {
      await screenshot(page, "desktop-top");
      await screenshot(page, "desktop-gallery", page.locator("#grounds"));
      await screenshot(page, "desktop-visit", page.locator("#visit"));
    }
    if (width === 390) {
      await screenshot(page, "mobile-top");
      await screenshot(page, "mobile-about", page.locator("#about"));
      await screenshot(page, "mobile-contact", page.locator("#contact"));
    }
    results.push({ width, horizontalOverflow: false, photosLoaded: 6, faqWorking: true, javascriptErrors: 0 });
    await context.close();
  }

  const staticContext = await prepareContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(url, { waitUntil: "load" });
  assert.equal(await staticPage.locator("h1").innerText(), "延命院");
  await staticPage.locator(".faq-list summary").first().click();
  assert.equal(await staticPage.locator(".faq-list details").first().getAttribute("open"), "");
  assert.equal(await staticPage.locator(".mobile-actions a").count(), 4);
  await staticContext.close();

  const motionContext = await prepareContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  const motionPage = await motionContext.newPage();
  const motionErrors = [];
  motionPage.on("pageerror", error => motionErrors.push(error.message));
  await motionPage.goto(url, { waitUntil: "domcontentloaded" });
  await motionPage.waitForFunction(() => document.getAnimations().length > 0);
  await motionPage.emulateMedia({ reducedMotion: "reduce" });
  await motionPage.waitForFunction(() => document.getAnimations().length === 0);
  assert.deepEqual(motionErrors, []);
  await motionContext.close();

  const report = { preservation: "pass", viewports: results, noJavaScript: "pass", reducedMotion: "pass", nativeContactLinks: "pass" };
  await writeFile("design-review/report.json", JSON.stringify(report, null, 2));
  console.log("FINAL_REPORT " + JSON.stringify(report));
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
