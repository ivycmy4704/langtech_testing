console.log("=== PROGEN AI REGISTER PAGE LOADED ===");

let valuePromptCount = 0;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Add click event to the button
  const addButton = document.getElementById('addValueBtn');
  addButton.addEventListener('click', addValuePrompt);
  console.log("Add button event listener attached");
  
  // Initialize form
  updateAddButtonState();
  console.log("Page initialization complete");
});

/* ---------- Add Value Prompt Function ---------- */
function addValuePrompt() {
  console.log("🎯 ADD VALUE BUTTON CLICKED! Current count:", valuePromptCount);
  
  if (valuePromptCount >= 5) {
    alert("Maximum 5 value prompts allowed.");
    return;
  }
  
  valuePromptCount++;
  console.log("New count:", valuePromptCount);

  const container = document.getElementById("valuePrompts");
  const wrapper = document.createElement("div");
  wrapper.className = "value-wrapper";
  wrapper.innerHTML = `
    <div class="grid-2">
      <input type="text" placeholder="e.g. cartoon, 3D render, minimalist..." class="value-input" />
      <button type="button" class="btn-remove" onclick="removeValuePrompt(this)">Remove</button>
    </div>
  `;
  
  container.appendChild(wrapper);
  updateAddButtonState();
  
  // Focus on the new input
  const newInput = wrapper.querySelector('.value-input');
  newInput.focus();
  
  console.log("New value prompt added successfully");
}

/* ---------- Remove Value Prompt ---------- */
function removeValuePrompt(btn) {
  console.log("Removing value prompt");
  btn.closest(".value-wrapper").remove();
  valuePromptCount--;
  updateAddButtonState();
  console.log("Value prompt removed. New count:", valuePromptCount);
}

/* ---------- Update Button State ---------- */
function updateAddButtonState() {
  const addButton = document.getElementById('addValueBtn');
  if (valuePromptCount >= 5) {
    addButton.disabled = true;
    addButton.textContent = 'Maximum 5 values reached';
    console.log("Button disabled - max reached");
  } else {
    addButton.disabled = false;
    addButton.textContent = '+ Add Value';
    console.log("Button enabled");
  }
}

/* ---------- Custom Industry ---------- */
function toggleCustomIndustry() {
  const select = document.getElementById("industry");
  const custom = document.getElementById("customIndustry");
  custom.style.display = select.value === "Others" ? "block" : "none";
  
  if (select.value === "Others") {
    custom.required = true;
  } else {
    custom.required = false;
    custom.value = '';
  }
}

/* ---------- Form Submission ---------- */
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("📝 FORM SUBMITTED");

  // Collect form data
  const company = document.getElementById("company").value.trim();
  const email = document.getElementById("email").value.trim();
  const industrySelect = document.getElementById("industry").value;
  const customIndustry = document.getElementById("customIndustry").value.trim();
  const product = document.getElementById("productName").value.trim();
  const reqs = document.getElementById("requirements").value.trim();

  // Validation
  if (!company || !email || !product) {
    alert("Please fill in all required fields.");
    return;
  }

  const industry = industrySelect === "Others" ? customIndustry : industrySelect;
  if (industrySelect === "Others" && !customIndustry) {
    alert("Please specify your industry.");
    return;
  }

  // Collect value prompts
  const valueInputs = document.querySelectorAll("#valuePrompts .value-input");
  const valuePrompts = Array.from(valueInputs)
                        .map(i => i.value.trim())
                        .filter(v => v);

  const format = document.getElementById("format").value;
  const resolution = document.getElementById("resolution").value;

  // Generate unique code
  const code = "IND" + Math.random().toString(36).substr(2, 9).toUpperCase();

  console.log("Form data collected:", {
    company, email, industry, product, valuePrompts, code
  });

  // Store in localStorage
  const tempUser = {
    company, email, industry, product, requirements: reqs,
    valuePrompts, format, resolution,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem("tempUser", JSON.stringify(tempUser));
  localStorage.setItem("pendingCode", code);

  // For now, just show success message (we'll add EmailJS later)
  alert(`✅ Account created successfully!\nYour Industry Code: ${code}\nYou can now login with this code.`);
  
  // Redirect to login
  window.location.href = "index.html";
});

console.log("All JavaScript functions defined successfully");
