/* ================================================
   IMAGE SCANNER FRONTEND — script.js
   Backend endpoint : POST http://localhost:8000/scan
   Request          : multipart/form-data  (field: "file")
   Response         : { "Phone": [], "Email": [], "URLs": [] }
   ================================================ */

const API_URL = "https://image-scanner-api-gihl.onrender.com/scan";

// ── DOM refs ───────────────────────────────────────────────────────────────
const fileInput     = document.getElementById("fileInput");
const browseBtn     = document.getElementById("browseBtn");
const dropZone      = document.getElementById("dropZone");
const idleState     = document.getElementById("idleState");
const previewState  = document.getElementById("previewState");
const previewImg    = document.getElementById("previewImg");
const previewName   = document.getElementById("previewName");
const previewSize   = document.getElementById("previewSize");
const changeBtn     = document.getElementById("changeBtn");
const scanBtn       = document.getElementById("scanBtn");

const uploadSection  = document.getElementById("uploadSection");
const loadingSection = document.getElementById("loadingSection");
const resultsSection = document.getElementById("resultsSection");

const loadingTitle  = document.getElementById("loadingTitle");
const lstep1        = document.getElementById("lstep1");
const lstep2        = document.getElementById("lstep2");
const lstep3        = document.getElementById("lstep3");

const resultsHeadline = document.getElementById("resultsHeadline");
const cardsGrid       = document.getElementById("cardsGrid");

const emailList  = document.getElementById("emailList");
const phoneList  = document.getElementById("phoneList");
const urlList    = document.getElementById("urlList");
const emailCount = document.getElementById("emailCount");
const phoneCount = document.getElementById("phoneCount");
const urlCount   = document.getElementById("urlCount");
const emailNone  = document.getElementById("emailNone");
const phoneNone  = document.getElementById("phoneNone");
const urlNone    = document.getElementById("urlNone");

const allEmpty   = document.getElementById("allEmpty");
const resetBtn   = document.getElementById("resetBtn");

const toast      = document.getElementById("toast");
const toastMsg   = document.getElementById("toastMsg");
const toastClose = document.getElementById("toastClose");

// ── State ──────────────────────────────────────────────────────────────────
let selectedFile = null;

// ── File selection helpers ─────────────────────────────────────────────────
function setFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
    return;
  }
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src  = e.target.result;
  };
  reader.readAsDataURL(file);

  previewName.textContent = file.name;
  previewSize.textContent = formatBytes(file.size);

  idleState.classList.add("hidden");
  previewState.classList.remove("hidden");
  scanBtn.disabled = false;
}

function clearFile() {
  selectedFile    = null;
  fileInput.value = "";
  previewImg.src  = "";
  idleState.classList.remove("hidden");
  previewState.classList.add("hidden");
  scanBtn.disabled = true;
}

function formatBytes(bytes) {
  if (bytes < 1024)        return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ── Browse & drag-and-drop ─────────────────────────────────────────────────
browseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

dropZone.addEventListener("click", () => {
  if (!selectedFile) fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) setFile(fileInput.files[0]);
});

changeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  clearFile();
});

// Drag events
["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("over");
  });
});

["dragleave", "dragend", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("over");
  });
});

dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

// ── Loading animation helpers ──────────────────────────────────────────────
let loadingTimer = null;

function startLoadingAnimation() {
  // Reset steps
  [lstep1, lstep2, lstep3].forEach((s) => {
    s.classList.remove("active", "done");
  });
  lstep1.classList.add("active");
  loadingTitle.textContent = "Running OCR…";

  loadingTimer = setTimeout(() => {
    lstep1.classList.remove("active");
    lstep1.classList.add("done");
    lstep2.classList.add("active");
    loadingTitle.textContent = "Detecting patterns…";
  }, 1400);
}

function stopLoadingAnimation() {
  clearTimeout(loadingTimer);
  lstep2.classList.remove("active");
  lstep2.classList.add("done");
  lstep3.classList.add("active");
  lstep3.classList.add("done");
  loadingTitle.textContent = "Done!";
}

// ── Show / hide panels ─────────────────────────────────────────────────────
function showPanel(name) {
  uploadSection.classList.add("hidden");
  loadingSection.classList.add("hidden");
  resultsSection.classList.add("hidden");

  if (name === "upload")  uploadSection.classList.remove("hidden");
  if (name === "loading") loadingSection.classList.remove("hidden");
  if (name === "results") resultsSection.classList.remove("hidden");
}

// ── Toast (error messages) ─────────────────────────────────────────────────
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.remove("hidden");
}

function hideToast() {
  toast.classList.add("hidden");
}

toastClose.addEventListener("click", hideToast);

// ── Render one result card ─────────────────────────────────────────────────
/**
 * @param {HTMLElement} listEl   — the <ul> to fill
 * @param {HTMLElement} countEl  — the "N found" span
 * @param {HTMLElement} noneEl   — the "nothing found" <p>
 * @param {string[]}    items    — array of strings
 * @param {boolean}     isUrl    — whether to render as clickable links
 */
function renderCard(listEl, countEl, noneEl, items, isUrl = false) {
  listEl.innerHTML = "";

  const count = items.length;
  countEl.textContent = count === 0 ? "none found"
                      : count === 1 ? "1 found"
                      : `${count} found`;

  if (count === 0) {
    noneEl.classList.remove("hidden");
    return;
  }

  noneEl.classList.add("hidden");

  items.forEach((raw, i) => {
    const value = raw.trim();
    if (!value) return;

    const li = document.createElement("li");
    li.style.animationDelay = `${i * 0.04}s`;

    const valSpan = document.createElement("span");
    valSpan.className = "item-val";

    if (isUrl) {
      const href = value.startsWith("http") ? value : "https://" + value;
      const a = document.createElement("a");
      a.href   = href;
      a.target = "_blank";
      a.rel    = "noopener noreferrer";
      a.textContent = value;
      valSpan.appendChild(a);
    } else {
      valSpan.textContent = value;
    }

    const copyBtn = document.createElement("button");
    copyBtn.className   = "copy-btn";
    copyBtn.textContent = "copy";
    copyBtn.addEventListener("click", () => copyToClipboard(value, copyBtn));

    li.appendChild(valSpan);
    li.appendChild(copyBtn);
    listEl.appendChild(li);
  });
}

// ── Copy to clipboard ──────────────────────────────────────────────────────
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✓ copied";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "copy";
      btn.classList.remove("copied");
    }, 1800);
  }).catch(() => {
    showToast("Could not copy to clipboard.");
  });
}

// ── Main scan handler ──────────────────────────────────────────────────────
scanBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  hideToast();
  showPanel("loading");
  startLoadingAnimation();

  const formData = new FormData();
  formData.append("file", selectedFile);   // field name must be "file" (matches FastAPI)

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      // Note: do NOT set Content-Type header manually —
      // the browser sets it automatically with the correct boundary for multipart/form-data
    });

    if (!response.ok) {
      let errDetail = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.detail) errDetail = errJson.detail;
      } catch (_) { /* ignore */ }
      throw new Error(errDetail);
    }

    const data = await response.json();
    // API returns: { "Phone": [...], "Email": [...], "URLs": [...] }

    stopLoadingAnimation();

    // Small pause so the user sees "Done!" before results appear
    await delay(500);

    renderResults(data);
    showPanel("results");

  } catch (err) {
    stopLoadingAnimation();
    showPanel("upload");

    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      showToast("Cannot reach the backend. Make sure the FastAPI server is running on http://localhost:8000.");
    } else {
      showToast(err.message || "An unexpected error occurred.");
    }
  }
});

// ── Render results ─────────────────────────────────────────────────────────
function renderResults(data) {
  // Normalise keys — the API returns "Phone", "Email", "URLs"
  const emails = Array.isArray(data.Email) ? data.Email : [];
  const phones = Array.isArray(data.Phone) ? data.Phone : [];
  const urls   = Array.isArray(data.URLs)  ? data.URLs  : [];

  renderCard(emailList, emailCount, emailNone, emails, false);
  renderCard(phoneList, phoneCount, phoneNone, phones, false);
  renderCard(urlList,   urlCount,   urlNone,   urls,   true);

  const total = emails.length + phones.length + urls.length;

  if (total === 0) {
    cardsGrid.classList.add("hidden");
    allEmpty.classList.remove("hidden");
    resultsHeadline.innerHTML = "Scan complete. <em>Nothing found.</em>";
  } else {
    cardsGrid.classList.remove("hidden");
    allEmpty.classList.add("hidden");
    const parts = [];
    if (emails.length) parts.push(`<em>${emails.length}</em> email${emails.length > 1 ? "s" : ""}`);
    if (phones.length) parts.push(`<em>${phones.length}</em> phone number${phones.length > 1 ? "s" : ""}`);
    if (urls.length)   parts.push(`<em>${urls.length}</em> URL${urls.length > 1 ? "s" : ""}`);
    resultsHeadline.innerHTML = "Found " + parts.join(", ") + ".";
  }
}

// ── Reset ──────────────────────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  clearFile();
  hideToast();
  showPanel("upload");
});

// ── Utility ────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}