// Real AI Integration
let currentPreview = null;
let referenceImageBase64 = null;

function previewImage() {
  const file = document.getElementById('refImage').files[0];
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      referenceImageBase64 = e.target.result;
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '220px';
      img.style.borderRadius = '10px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

async function callRealAPI(generator, prompt, user) {
  const fullPrompt = `${prompt}. Style: ${user.valuePrompts?.join(', ') || 'professional'}. Industry: ${user.industry}. Product: ${user.productName}.`;
  let url, options;

  switch (generator) {
    case 'pollination':
      // Pollination.ai - No key needed, public API
      url = `https://pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&seed=${Date.now()}&nologo=true&enhance=false`;
      return fetch(url).then(res => res.blob()).then(blob => URL.createObjectURL(blob));

    case 'openai':
      // OpenAI DALL·E 3
      url = 'https://api.openai.com/v1/images/generations';
      options = {
        method: 'POST',
        headers: { 'Authorization': `Bearer YOUR_OPENAI_API_KEY`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      };
      const openaiRes = await fetch(url, options);
      const data = await openaiRes.json();
      return data.data[0].url;

    case 'stability':
      // Stability AI SDXL
      url = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
      options = {
        method: 'POST',
        headers: { 'Authorization': `Bearer YOUR_STABILITY_API_KEY`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_prompts: [{ text: fullPrompt }],
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30
        })
      };
      const stabilityRes = await fetch(url, options);
      const stabilityData = await stabilityRes.json();
      return `data:image/png;base64,${stabilityData.artifacts[0].base64}`;
  }
}

function generatePreviewText() {
  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) return alert('Enter prompt.');

  const user = getCurrentUser();
  if (!user) return window.location.href = 'index.html';

  // Free local preview
  const text = `AI will generate: "${prompt}" using your ${user.productName} details in ${user.resolution}.`;
  document.getElementById('previewText').textContent = text;
  document.getElementById('previewText').classList.remove('hidden');
  document.getElementById('confirmSection').classList.remove('hidden');
  currentPreview = { prompt, generator: document.querySelector('input[name="generator"]:checked').value };
}

async function confirmGeneration() {
  const user = getCurrentUser();
  if (!deductCredits(2)) {
    document.getElementById('creditWarning').textContent = 'Low credits!';
    document.getElementById('creditWarning').classList.remove('hidden');
    return;
  }

  document.getElementById('loading').classList.remove('hidden');
  const results = document.getElementById('results');
  results.innerHTML = '';
  results.classList.remove('hidden');

  const generator = currentPreview.generator;
  try {
    // Generate 2 images
    for (let i = 0; i < 2; i++) {
      const imgUrl = await callRealAPI(generator, currentPreview.prompt + ` Variation ${i + 1}`, user);
      if (imgUrl) {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Illustration ${i + 1}`;
        results.appendChild(img);
      } else {
        // Fallback
        img.src = `https://picsum.photos/seed/${Date.now() + i}/600/600`;
        results.appendChild(img);
      }
    }
  } catch (error) {
    alert('API error - using fallback. Check console.');
    console.error(error);
    // Fallback images
    for (let i = 0; i < 2; i++) {
      const img = document.createElement('img');
      img.src = `https://picsum.photos/seed/${Date.now() + i}/600/600`;
      results.appendChild(img);
    }
  }

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('confirmSection').classList.add('hidden');
  document.getElementById('previewText').classList.add('hidden');
}

function cancelGeneration() {
  document.getElementById('confirmSection').classList.add('hidden');
  document.getElementById('previewText').classList.add('hidden');
}

// Events
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('refImage')?.addEventListener('change', previewImage);
});
