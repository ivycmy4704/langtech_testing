console.log("=== PROGEN AI 註冊頁面已載入 ===");

let valuePromptCount = 0;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM 完全載入");
  
  // Add click event to the button
  const addButton = document.getElementById('addValueBtn');
  addButton.addEventListener('click', addValuePrompt);
  console.log("新增按鈕事件監聽器已附加");
  
  // Initialize form
  updateAddButtonState();
  console.log("頁面初始化完成");
});

/* ---------- 新增數值提示功能 ---------- */
function addValuePrompt() {
  console.log("🎯 新增數值按鈕被點擊！目前計數：", valuePromptCount);
  
  if (valuePromptCount >= 5) {
    alert("最多允許5個數值提示。");
    return;
  }
  
  valuePromptCount++;
  console.log("新計數：", valuePromptCount);

  const container = document.getElementById("valuePrompts");
  const wrapper = document.createElement("div");
  wrapper.className = "value-wrapper";
  wrapper.innerHTML = `
    <div class="grid-2">
      <input type="text" placeholder="例如：卡通、3D渲染、極簡風格..." class="value-input" />
      <button type="button" class="btn-remove" onclick="removeValuePrompt(this)">移除</button>
    </div>
  `;
  
  container.appendChild(wrapper);
  updateAddButtonState();
  
  // Focus on the new input
  const newInput = wrapper.querySelector('.value-input');
  newInput.focus();
  
  console.log("新數值提示新增成功");
}

/* ---------- 移除數值提示 ---------- */
function removeValuePrompt(btn) {
  console.log("移除數值提示");
  btn.closest(".value-wrapper").remove();
  valuePromptCount--;
  updateAddButtonState();
  console.log("數值提示已移除。新計數：", valuePromptCount);
}

/* ---------- 更新按鈕狀態 ---------- */
function updateAddButtonState() {
  const addButton = document.getElementById('addValueBtn');
  if (valuePromptCount >= 5) {
    addButton.disabled = true;
    addButton.textContent = '已達最大值5個';
    console.log("按鈕已停用 - 已達最大值");
  } else {
    addButton.disabled = false;
    addButton.textContent = '+ 新增數值';
    console.log("按鈕已啟用");
  }
}

/* ---------- 自訂行業 ---------- */
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

/* ---------- 表單提交 ---------- */
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("📝 表單已提交");

  // Collect form data
  const company = document.getElementById("company").value.trim();
  const email = document.getElementById("email").value.trim();
  const industrySelect = document.getElementById("industry").value;
  const customIndustry = document.getElementById("customIndustry").value.trim();
  const product = document.getElementById("productName").value.trim();
  const reqs = document.getElementById("requirements").value.trim();

  // Validation
  if (!company || !email || !product) {
    alert("請填寫所有必填欄位。");
    return;
  }

  const industry = industrySelect === "Others" ? customIndustry : industrySelect;
  if (industrySelect === "Others" && !customIndustry) {
    alert("請指定您的行業。");
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

  console.log("表單資料已收集：", {
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
  alert(`✅ 帳戶建立成功！\n您的行業代碼：${code}\n您現在可以使用此代碼登入。`);
  
  // Redirect to login
  window.location.href = "index.html";
});

console.log("所有 JavaScript 功能定義成功");
