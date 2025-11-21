// ProGen AI Dashboard - COMPLETELY FIXED VERSION
console.log("🚀 ProGen AI Dashboard Initialized");

// Global variables
let credits = 20;
let currentUser = null;
let productName = "Your Product";

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log("📦 Loading dashboard...");
    
    // Get current user
    currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
        alert("Please log in to access the dashboard.");
        window.location.href = 'index.html';
        return;
    }
    
    // Get product name
    productName = localStorage.getItem('userProduct') || 'Your Product';
    
    // Update UI
    document.getElementById('productNameDisplay').textContent = productName;
    document.getElementById('lockedProductName').textContent = productName;
    
    // Load credits
    credits = parseInt(localStorage.getItem('progen_credits')) || 20;
    updateCreditsUI();
    
    console.log("✅ Dashboard loaded successfully");
    console.log("User:", currentUser.email);
    console.log("Product:", productName);
    console.log("Credits:", credits);
});

// Update credits display
function updateCreditsUI() {
    document.getElementById('creditDisplay').textContent = `Credits: ${credits}`;
    localStorage.setItem('progen_credits', credits);
}

// Check and deduct credits
function deductCredits(amount) {
    if (credits < amount) {
        alert(`Not enough credits! You need ${amount} credits but only have ${credits}.`);
        return false;
    }
    credits -= amount;
    updateCreditsUI();
    return true;
}

// Get full prompt including product name
function getFullPrompt() {
    const style = document.getElementById('prompt').value.trim();
    return style ? `${productName}, ${style}` : productName;
}

// Add tag to prompt - FIXED: Now properly adds tags
function addTag(text) {
    console.log("Adding tag:", text);
    const textarea = document.getElementById('prompt');
    const current = textarea.value.trim();
    if (current) {
        textarea.value = current + ", " + text;
    } else {
        textarea.value = text;
    }
    textarea.focus();
}

// Main generation function - FIXED: Proper history linking
async function generateNow() {
    console.log("🎨 Starting image generation...");
    
    if (!deductCredits(2)) {
        return;
    }

    const prompt = getFullPrompt();
    console.log("Using prompt:", prompt);

    // Show loading state
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'grid';
    document.getElementById('regenSection').style.display = 'none';

    const generationId = Date.now().toString();
    const generationDate = new Date().toISOString();

    // Generate 2 images
    for (let i = 0; i < 2; i++) {
        const seed = Math.floor(Math.random() * 999999) + i;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=960&height=960&seed=${seed}&nologo=true&model=flux-schnell`;
        
        console.log(`Generating image ${i+1}:`, imageUrl);
        
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div class="image-container">
                <div class="loader-wrapper">
                    <div class="spinner"></div>
                    <div class="timer-text">5.0s</div>
                </div>
                <img src="${imageUrl}" alt="Generated image" 
                     onload="handleImageLoad(this, '${imageUrl}', '${prompt}', ${i+1}, '${generationId}', '${generationDate}')"
                     onerror="handleImageError(this, '${imageUrl}', '${prompt}', ${i+1}, '${generationId}', '${generationDate}')"
                     style="display:none;">
            </div>
            <div style="padding: 1rem; display: flex; gap: 8px; justify-content: center;">
                <button class="btn-sm btn-primary" onclick="downloadImage('${imageUrl}', ${i+1})" style="cursor:pointer;">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn-sm btn-accent" onclick="addToFavorites('${imageUrl}', '${prompt}', ${i+1}, '${generationId}', '${generationDate}')" style="cursor:pointer;">
                    <i class="fas fa-star"></i> Favorite
                </button>
            </div>
        `;
        resultsDiv.appendChild(card);

        // Start countdown timer
        startCountdownTimer(card, i);
    }

    document.getElementById('regenSection').style.display = 'block';
}

// Handle successful image load - FIXED: Proper history saving
function handleImageLoad(imgElement, imageUrl, prompt, imageNumber, generationId, generationDate) {
    console.log(`✅ Image ${imageNumber} loaded successfully`);
    imgElement.style.display = 'block';
    imgElement.previousElementSibling.style.display = 'none';
    
    // Save to history - THIS IS CRITICAL FOR HISTORY LINKING
    saveToHistory(imageUrl, prompt, imageNumber, generationId, generationDate);
}

// Handle image load error - Still save to history
function handleImageError(imgElement, imageUrl, prompt, imageNumber, generationId, generationDate) {
    console.error(`❌ Image ${imageNumber} failed to load`);
    imgElement.previousElementSibling.innerHTML = `
        <div style="text-align: center; color: #dc3545; padding: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>Failed to load image</p>
        </div>
    `;
    
    // Still save to history for reference
    saveToHistory(imageUrl, prompt, imageNumber, generationId, generationDate);
}

// Countdown timer for image loading
function startCountdownTimer(card, index) {
    let timeLeft = 5.0;
    const timerEl = card.querySelector('.timer-text');
    const timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            timerEl.textContent = "Finishing...";
            clearInterval(timerInterval);
        } else {
            timerEl.textContent = timeLeft.toFixed(1) + "s";
        }
    }, 100);
}

// ✅ FIXED: Save image to history - PROPERLY LINKED
function saveToHistory(imageUrl, prompt, imageNumber, generationId, generationDate) {
    const historyItem = {
        id: `${generationId}_${imageNumber}`,
        imageUrl: imageUrl,
        prompt: prompt,
        productName: productName,
        imageNumber: imageNumber,
        generationId: generationId,
        timestamp: generationDate,
        isFavorite: false,
        downloads: 0
    };

    console.log("💾 Saving to history:", historyItem);

    // Get current user's history or initialize
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    
    // Check if this image already exists in history
    const existingIndex = userHistory.findIndex(item => item.id === historyItem.id);
    if (existingIndex === -1) {
        userHistory.unshift(historyItem); // Add to beginning
        localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
        console.log('✅ Image saved to history:', historyItem.id);
        
        // If we're on the history page, refresh it
        if (document.getElementById('historySection').style.display !== 'none') {
            loadHistory();
        }
    }
}

// Add to favorites from generation results
function addToFavorites(imageUrl, prompt, imageNumber, generationId, generationDate) {
    const historyItem = {
        id: `${generationId}_${imageNumber}`,
        imageUrl: imageUrl,
        prompt: prompt,
        productName: productName,
        imageNumber: imageNumber,
        generationId: generationId,
        timestamp: generationDate,
        isFavorite: true,
        downloads: 0
    };

    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    
    // Check if image exists in history
    const existingIndex = userHistory.findIndex(item => item.id === historyItem.id);
    if (existingIndex !== -1) {
        // Update existing item
        userHistory[existingIndex].isFavorite = true;
    } else {
        // Add new favorite item
        userHistory.unshift(historyItem);
    }
    
    localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
    
    alert('⭐ Image added to favorites!');
    console.log('⭐ Added to favorites:', historyItem.id);
    
    // Refresh history if on history page
    if (document.getElementById('historySection').style.display !== 'none') {
        loadHistory();
    }
}

// ✅ FIXED: Load and display history
function loadHistory() {
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    console.log("📁 Loading history:", userHistory.length, "items found");
    
    const historyGrid = document.getElementById('historyGrid');
    const recentGrid = document.getElementById('recentGrid');
    const favoritesGrid = document.getElementById('favoritesGrid');

    // Clear existing content
    [historyGrid, recentGrid, favoritesGrid].forEach(grid => {
        if (grid) grid.innerHTML = '';
    });

    if (userHistory.length === 0) {
        const emptyMessage = `
            <div class="empty-state">
                <i class="fas fa-images"></i>
                <h3>No images yet</h3>
                <p>Generate some beautiful product images to see them here!</p>
                <button class="btn-primary" onclick="showGenerationSection()" style="margin-top: 1rem; cursor:pointer;">
                    Generate Images Now
                </button>
            </div>
        `;
        [historyGrid, recentGrid, favoritesGrid].forEach(grid => {
            if (grid) grid.innerHTML = emptyMessage;
        });
        return;
    }

    // Recent items (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentItems = userHistory.filter(item => new Date(item.timestamp) > oneWeekAgo);
    
    // Favorite items
    const favoriteItems = userHistory.filter(item => item.isFavorite === true);

    console.log("📊 History stats - All:", userHistory.length, "Recent:", recentItems.length, "Favorites:", favoriteItems.length);

    // Render all items
    renderHistoryItems(userHistory, historyGrid, 'all');
    renderHistoryItems(recentItems, recentGrid, 'recent');
    renderHistoryItems(favoriteItems, favoritesGrid, 'favorites');
}

// Render history items
function renderHistoryItems(items, container, tabType) {
    if (!container) return;
    
    if (items.length === 0) {
        let message = '';
        let button = '';
        
        switch(tabType) {
            case 'favorites':
                message = 'No favorite images yet. Click the "Favorite" button on any image to add it to favorites!';
                button = '<button class="btn-primary" onclick="switchTab(\'all\')" style="margin-top: 1rem; cursor:pointer;">View All Images</button>';
                break;
            case 'recent':
                message = 'No recent images. Images from the last 7 days will appear here.';
                button = '<button class="btn-primary" onclick="switchTab(\'all\')" style="margin-top: 1rem; cursor:pointer;">View All Images</button>';
                break;
            default:
                message = 'No images found.';
        }
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No images found</h3>
                <p>${message}</p>
                ${button}
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="history-card">
            <div class="history-image-container">
                <img src="${item.imageUrl}" alt="${item.prompt}" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMmY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'">
            </div>
            <div class="history-info">
                <div class="history-prompt" title="${item.prompt}">
                    ${item.prompt.length > 60 ? item.prompt.substring(0, 60) + '...' : item.prompt}
                </div>
                <div class="history-date">
                    <span>${new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>Image ${item.imageNumber}</span>
                </div>
                <div class="history-actions">
                    <button class="btn-sm btn-primary" onclick="downloadImage('${item.imageUrl}', ${item.imageNumber})" style="cursor:pointer;">
                        <i class="fas fa-download"></i> 
                    </button>
                    <button class="btn-sm ${item.isFavorite ? 'btn-accent' : 'btn-secondary'}" 
                            onclick="toggleFavorite('${item.id}', this)" style="cursor:pointer;">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="btn-sm btn-secondary" onclick="regenerateFromHistory('${item.prompt}')" style="cursor:pointer;">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle favorite
function toggleFavorite(imageId, buttonElement) {
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    const itemIndex = userHistory.findIndex(item => item.id === imageId);
    
    if (itemIndex !== -1) {
        userHistory[itemIndex].isFavorite = !userHistory[itemIndex].isFavorite;
        localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
        
        // Update button appearance
        if (buttonElement) {
            if (userHistory[itemIndex].isFavorite) {
                buttonElement.className = 'btn-sm btn-accent';
            } else {
                buttonElement.className = 'btn-sm btn-secondary';
            }
        }
        
        // Refresh the display
        loadHistory();
    }
}

// Regenerate from history
function regenerateFromHistory(prompt) {
    document.getElementById('prompt').value = prompt;
    showGenerationSection();
    generateNow();
}

// Download image
function downloadImage(url, num) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.replace(/ /g, '_')}_${num}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Track download in history
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    const itemIndex = userHistory.findIndex(item => item.imageUrl === url);
    if (itemIndex !== -1) {
        userHistory[itemIndex].downloads = (userHistory[itemIndex].downloads || 0) + 1;
        localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
    }
}

// ✅ FIXED: Navigation functions - ALL BUTTONS WORK
function viewHistory() {
    document.getElementById('generationSection').style.display = 'none';
    document.getElementById('historySection').style.display = 'block';
    loadHistory();
}

function showGenerationSection() {
    document.getElementById('generationSection').style.display = 'block';
    document.getElementById('historySection').style.display = 'none';
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Reload history for the selected tab
    loadHistory();
}

// ✅ FIXED: User info function
function viewUserInfo() {
    alert(`My Brand Info:\n\nCompany: ${currentUser.company || 'Not set'}\nEmail: ${currentUser.email || 'Not set'}\nIndustry: ${currentUser.industry || 'Not set'}\nProduct: ${productName}`);
}

// Refine modal functions
function openRefineModal() {
    document.getElementById('refineModal').style.display = 'flex';
    document.getElementById('refineInput').focus();
}

function closeRefineModal() {
    document.getElementById('refineModal').style.display = 'none';
}

function applyRefinement() {
    const feedback = document.getElementById('refineInput').value.trim();
    if (feedback) {
        const current = document.getElementById('prompt').value.trim();
        document.getElementById('prompt').value = current ? current + ", " + feedback : feedback;
    }
    document.getElementById('refineModal').style.display = 'none';
    document.getElementById('refineInput').value = '';
    generateNow();
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

console.log("✅ COMPLETELY FIXED Dashboard JS loaded successfully!");
