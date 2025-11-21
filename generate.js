// Enhanced ProGen AI Dashboard with WORKING Image History System
let currentPreview = null;
let referenceImageBase64 = null;
let credits = parseInt(localStorage.getItem('progen_credits')) || 20;
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const productName = localStorage.getItem('userProduct') || 'Your Product';

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 ProGen AI Dashboard Initialized");
    console.log("Current User:", currentUser);
    
    // Set up product name display
    document.getElementById('productNameDisplay').textContent = productName;
    document.getElementById('lockedProductName').textContent = productName;
    
    // Update credits display
    updateCreditsUI();
    
    // Focus on prompt input
    document.getElementById('prompt').focus();
    
    // Load existing image history
    loadHistory();
});

// Update credits display
function updateCreditsUI() {
    document.getElementById('creditDisplay').textContent = `Credits: ${credits}`;
    localStorage.setItem('progen_credits', credits);
}

// Check and deduct credits
function deductCredits(amount) {
    if (credits < amount) {
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

// Add tag to prompt
function addTag(text) {
    const textarea = document.getElementById('prompt');
    const current = textarea.value.trim();
    textarea.value = current ? current + ", " + text : text;
    textarea.focus();
}

// Main generation function - FIXED HISTORY SAVING
async function generateNow() {
    if (!deductCredits(2)) {
        alert("Not enough credits! Contact support to get more.");
        return;
    }

    const prompt = getFullPrompt();
    const user = currentUser;
    if (!user.id) {
        alert("Please log in again.");
        window.location.href = 'index.html';
        return;
    }

    console.log("🎨 Generating images for prompt:", prompt);

    // Show loading state
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'grid';
    document.getElementById('regenSection').style.display = 'none';

    const generationId = Date.now().toString();
    const generationDate = new Date().toISOString();

    // Generate 2 images
    for (let i = 0; i < 2; i++) {
        try {
            const seed = Math.floor(Math.random() * 999999);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=960&height=960&seed=${seed + i}&nologo=true&model=flux-schnell`;
            
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
                         onerror="handleImageError(this, '${imageUrl}', '${prompt}', ${i+1}, '${generationId}', '${generationDate}')">
                </div>
                <div style="padding: 1rem; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-sm btn-primary" onclick="downloadImage('${imageUrl}', ${i+1})">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-sm btn-accent" onclick="addToFavorites('${imageUrl}', '${prompt}', ${i+1}, '${generationId}', '${generationDate}')">
                        <i class="fas fa-star"></i> Favorite
                    </button>
                </div>
            `;
            resultsDiv.appendChild(card);

            // Start countdown timer
            startCountdownTimer(card, i);

        } catch (error) {
            console.error('Generation error:', error);
            // Create error card
            const errorCard = document.createElement('div');
            errorCard.className = 'result-card';
            errorCard.innerHTML = `
                <div class="image-container">
                    <div style="text-align: center; padding: 2rem; color: #dc3545;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>Failed to generate image</p>
                    </div>
                </div>
            `;
            resultsDiv.appendChild(errorCard);
        }
    }

    document.getElementById('regenSection').style.display = 'block';
}

// Handle successful image load - FIXED HISTORY SAVING
function handleImageLoad(imgElement, imageUrl, prompt, imageNumber, generationId, generationDate) {
    console.log("✅ Image loaded successfully:", imageUrl);
    imgElement.style.display = 'block';
    imgElement.previousElementSibling.style.display = 'none';
    
    // Save to history IMMEDIATELY
    saveToHistory(imageUrl, prompt, imageNumber, generationId, generationDate);
}

// Handle image load error - STILL SAVE TO HISTORY
function handleImageError(imgElement, imageUrl, prompt, imageNumber, generationId, generationDate) {
    console.error("❌ Image failed to load:", imageUrl);
    imgElement.previousElementSibling.innerHTML = `
        <div style="text-align: center; color: #dc3545;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>Failed to load image</p>
        </div>
    `;
    
    // Still save the URL to history for reference
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

// ✅ FIXED: Image History System - PROPERLY SAVES IMAGES
function saveToHistory(imageUrl, prompt, imageNumber, generationId, generationDate) {
    const historyItem = {
        id: `${generationId}_${imageNumber}`,
        imageUrl: imageUrl,
        prompt: prompt,
        productName: productName,
        imageNumber: imageNumber,
        generationId: generationId,
        timestamp: generationDate,
        isFavorite: false, // Start as not favorite
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
        console.log('📸 Image saved to history:', historyItem.id);
        
        // Update history display if we're on the history page
        if (document.getElementById('historySection').style.display !== 'none') {
            loadHistory();
        }
    } else {
        console.log('📸 Image already in history:', historyItem.id);
    }
}

// ✅ FIXED: Add to favorites from generation results
function addToFavorites(imageUrl, prompt, imageNumber, generationId, generationDate) {
    const historyItem = {
        id: `${generationId}_${imageNumber}`,
        imageUrl: imageUrl,
        prompt: prompt,
        productName: productName,
        imageNumber: imageNumber,
        generationId: generationId,
        timestamp: generationDate,
        isFavorite: true, // Mark as favorite
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
    
    // Show confirmation
    alert('⭐ Image added to favorites!');
    console.log('⭐ Added to favorites:', historyItem.id);
    
    // Refresh history if on history page
    if (document.getElementById('historySection').style.display !== 'none') {
        loadHistory();
    }
}

// ✅ FIXED: Load and display history properly
function loadHistory() {
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    console.log("📁 Loading history for user:", currentUser.id, "Items found:", userHistory.length);
    
    const historyGrid = document.getElementById('historyGrid');
    const recentGrid = document.getElementById('recentGrid');
    const favoritesGrid = document.getElementById('favoritesGrid');

    // Clear existing content
    [historyGrid, recentGrid, favoritesGrid].forEach(grid => {
        if (grid) grid.innerHTML = '';
    });

    if (userHistory.length === 0) {
        const emptyMessage = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-images" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No images yet</h3>
                <p style="color: #888;">Generate some beautiful product images to see them here!</p>
                <button class="btn-primary" onclick="showGenerationSection()" style="margin-top: 1rem;">
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

    console.log("📊 History Stats - All:", userHistory.length, "Recent:", recentItems.length, "Favorites:", favoriteItems.length);

    // Render all items
    renderHistoryItems(userHistory, historyGrid, 'all');
    renderHistoryItems(recentItems, recentGrid, 'recent');
    renderHistoryItems(favoriteItems, favoritesGrid, 'favorites');
}

// ✅ FIXED: Render history items with PROPER FAVORITE BUTTONS
function renderHistoryItems(items, container, tabType) {
    if (!container) return;
    
    if (items.length === 0) {
        let message = '';
        switch(tabType) {
            case 'favorites':
                message = 'No favorite images yet. Click the star button on any image to add it to favorites!';
                break;
            case 'recent':
                message = 'No recent images. Images from the last 7 days will appear here.';
                break;
            default:
                message = 'No images found. Generate some images first!';
        }
        
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No images found</h3>
                <p style="color: #888;">${message}</p>
                ${tabType === 'favorites' ? '<button class="btn-primary" onclick="switchTab(\'all\')" style="margin-top: 1rem;">View All Images</button>' : ''}
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="history-card">
            <div class="history-image-container">
                <img src="${item.imageUrl}" alt="${item.prompt}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMmY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'">
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
                    <button class="btn-sm btn-primary" onclick="downloadImage('${item.imageUrl}', ${item.imageNumber})">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-sm ${item.isFavorite ? 'btn-accent' : 'btn-secondary'}" 
                            onclick="toggleFavorite('${item.id}', this)">
                        <i class="fas ${item.isFavorite ? 'fa-star' : 'fa-star'}"></i> 
                        ${item.isFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                    <button class="btn-sm btn-secondary" onclick="regenerateFromHistory('${item.prompt}')">
                        <i class="fas fa-redo"></i> Regenerate
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ✅ FIXED: Toggle favorite with visual feedback
function toggleFavorite(imageId, buttonElement) {
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    const itemIndex = userHistory.findIndex(item => item.id === imageId);
    
    if (itemIndex !== -1) {
        userHistory[itemIndex].isFavorite = !userHistory[itemIndex].isFavorite;
        localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
        
        // Update button appearance immediately
        if (buttonElement) {
            if (userHistory[itemIndex].isFavorite) {
                buttonElement.className = 'btn-sm btn-accent';
                buttonElement.innerHTML = '<i class="fas fa-star"></i> Favorited';
            } else {
                buttonElement.className = 'btn-sm btn-secondary';
                buttonElement.innerHTML = '<i class="fas fa-star"></i> Favorite';
            }
        }
        
        // Refresh the favorites tab
        loadHistory();
        
        console.log('⭐ Favorite toggled for:', imageId, 'New state:', userHistory[itemIndex].isFavorite);
    }
}

function regenerateFromHistory(prompt) {
    document.getElementById('prompt').value = prompt;
    showGenerationSection();
    generateNow();
}

function downloadImage(url, num) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.replace(/ /g, '_')}_${num}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Track download in history
    const userHistory = JSON.parse(localStorage.getItem(`imageHistory_${currentUser.id}`) || '[]');
    const matchingItems = userHistory.filter(item => item.imageUrl === url);
    matchingItems.forEach(item => {
        item.downloads = (item.downloads || 0) + 1;
    });
    localStorage.setItem(`imageHistory_${currentUser.id}`, JSON.stringify(userHistory));
}

// Navigation functions
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

// Refine modal functions
function openRefineModal() {
    document.getElementById('refineModal').style.display = 'flex';
    document.getElementById('refineInput').focus();
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

// User management
function viewUserInfo() {
    window.location.href = 'user-info.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

console.log("✅ ENHANCED ProGen AI Dashboard JS loaded successfully!");
