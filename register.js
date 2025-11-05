/* --------------------------------------------------------------
   register.js – FIXED & FULLY FUNCTIONAL
   • Add up to 5 value prompts (with Remove)
   • Sends REAL e-mail via EmailJS (using YOUR IDs)
   • No “scale” field
   -------------------------------------------------------------- */

let valuePromptCount = 0;

/* ---------- Add / Remove Value Prompt ---------- */
function addValuePrompt() {
  if (valuePromptCount >= 5) {
    alert("Maximum 5 value prompts allowed.");
    return;
  }
  valuePromptCount++;

  const container = document.getElementById("valuePrompts");
  const wrapper = document.createElement("div");
  wrapper.className = "value-wrapper";
  wrapper.style.marginBottom = "0.5rem";

  wrapper.innerHTML = `
    <div class="grid-2">
      <input type="text" placeholder="e.g. cartoon" class="value-input" />
      <button type="button" class="btn-sm btn-secondary"
              onclick="removeValuePrompt(this)">Remove</button>
    </div>
  `;
  container.appendChild(wrapper);
}

/* called by the Remove button */
function removeValuePrompt(btn) {
  btn.closest(".value-wrapper").remove();
  valuePromptCount--;
}

/* ---------- Custom Industry ---------- */
function toggleCustomIndustry() {
  const select = document.getElementById("industry");
  const custom = document.getElementById("customIndustry");
  custom.style.display = select.value === "Others" ? "block" : "none";
}

/* ---------- EmailJS Configuration (YOUR REAL IDs) ---------- */
const EMAILJS_USER_ID     = "04haQDj1VizCiKBn4";        // ← Your Public Key
const EMAILJS_SERVICE_ID  = "service_1vi3zyz";          // ← Your Service ID
const EMAILJS_TEMPLATE_ID = "template_y5dzqi9";         // ← Your Template ID

emailjs.init(EMAILJS_USER_ID);

/* ---------- Form Submit ---------- */
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  /* ---- collect data ---- */
  const company   = document.getElementById("company").value.trim();
  const email     = document.getElementById("email").value.trim();
  const industrySelect = document.getElementById("industry").value;
  const customIndustry = document.getElementById("customIndustry").value.trim();
  const product   = document.getElementById("productName").value.trim();
  const reqs      = document.getElementById("requirements").value.trim();

  const industry = industrySelect === "Others" ? customIndustry : industrySelect;
  if (industrySelect === "Others" && !customIndustry) {
    return alert("Please specify your industry.");
  }

  const valueInputs = document.querySelectorAll("#valuePrompts .value-input");
  const valuePrompts = Array.from(valueInputs)
                        .map(i => i.value.trim())
                        .filter(v => v);

  const format    = document.getElementById("format").value;
  const resolution = document.getElementById("resolution").value;

  /* ---- generate unique code ---- */
  const code = "IND" + Math.random().toString(36).substr(2, 9).toUpperCase();

  /* ---- store temp user (for login) ---- */
  const tempUser = {
    company, email, industry, product, requirements: reqs,
    valuePrompts, format, resolution,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem("tempUser", JSON.stringify(tempUser));
  localStorage.setItem("pendingCode", code);

  /* ---- SEND E-MAIL via EmailJS ---- */
  const templateParams = {
    to_email: email,
    company_name: company,
    industry_code: code,
    product_name: product
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    alert(`Account created!\nYour code **${code}** has been e-mailed to **${email}**.`);
    window.location.href = "index.html";
  } catch (err) {
    console.error("EmailJS error:", err);
    alert(`E-mail failed to send.\nYour code is still saved locally: **${code}**\nCheck browser console for details.`);
    window.location.href = "index.html";
  }
});
