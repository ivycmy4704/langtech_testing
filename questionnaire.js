// Questionnaire Form Handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Questionnaire JS loaded');
    
    const questionnaireForm = document.getElementById('questionnaireForm');
    const productsContainer = document.getElementById('productsContainer');
    const addProductBtn = document.getElementById('addProductBtn');
    
    let productCount = 1;

    // Check if elements exist
    if (!questionnaireForm) {
        console.error('Form element not found!');
        return;
    }

    if (!addProductBtn) {
        console.error('Add product button not found!');
        return;
    }

    // Add product form
    addProductBtn.addEventListener('click', function() {
        productCount++;
        const productForm = document.createElement('div');
        productForm.style.background = 'white';
        productForm.style.padding = '1.5rem';
        productForm.style.marginBottom = '1rem';
        productForm.style.border = '1px solid #ddd';
        productForm.style.borderRadius = '6px';
        
        productForm.innerHTML = `
            <h3 style="margin-top: 0; color: #007bff;">Product ${productCount}</h3>
            
            <div style="margin-bottom: 1rem;">
                <label for="productName${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Product Name:</label>
                <input type="text" id="productName${productCount}" name="productName${productCount}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="productCategory${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Product Categories:</label>
                <input type="text" id="productCategory${productCount}" name="productCategory${productCount}" placeholder="e.g., cosmeceuticals, snacks" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="productFeatures${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Product Features (list 7-10 features):</label>
                <textarea id="productFeatures${productCount}" name="productFeatures${productCount}" rows="4" placeholder="e.g., imported from South Korea, awarded prizes" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="problemsSolved${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Problems the Products Can Help Solve:</label>
                <textarea id="problemsSolved${productCount}" name="problemsSolved${productCount}" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="advantages${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Advantages Over Other Products:</label>
                <textarea id="advantages${productCount}" name="advantages${productCount}" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="price${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Price:</label>
                <input type="text" id="price${productCount}" name="price${productCount}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="discount${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Discount:</label>
                <textarea id="discount${productCount}" name="discount${productCount}" rows="2" placeholder="e.g., Limited time offer, Special offer before [Date]" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="productAdjectives${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Suitable Adjectives for Copywriting:</label>
                <textarea id="productAdjectives${productCount}" name="productAdjectives${productCount}" rows="2" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="unsuitableCrowd${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Unsuitable Crowd/Threshold:</label>
                <textarea id="unsuitableCrowd${productCount}" name="unsuitableCrowd${productCount}" rows="2" placeholder="e.g., pregnant women, minors" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label for="productNotes${productCount}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Other Important Notes:</label>
                <textarea id="productNotes${productCount}" name="productNotes${productCount}" rows="2" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <button type="button" onclick="this.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Remove Product</button>
        `;
        productsContainer.appendChild(productForm);
    });

    // Form submission
    questionnaireForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Collect form data
        const formData = new FormData(questionnaireForm);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key === 'paymentMethods') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        // Validate required fields
        const requiredFields = ['brandName', 'address', 'phone', 'openingHours', 'advanceBooking'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
            alert('Please fill in all required fields: ' + missingFields.join(', '));
            return;
        }
        
        // Process products data
        const products = [];
        for (let i = 1; i <= productCount; i++) {
            const productName = data[`productName${i}`];
            if (productName && productName.trim() !== '') {
                products.push({
                    productName: productName,
                    productCategory: data[`productCategory${i}`],
                    productFeatures: data[`productFeatures${i}`],
                    problemsSolved: data[`problemsSolved${i}`],
                    advantages: data[`advantages${i}`],
                    price: data[`price${i}`],
                    discount: data[`discount${i}`],
                    productAdjectives: data[`productAdjectives${i}`],
                    unsuitableCrowd: data[`unsuitableCrowd${i}`],
                    productNotes: data[`productNotes${i}`]
                });
            }
        }
        
        // Remove product fields from main data object
        for (let i = 1; i <= productCount; i++) {
            delete data[`productName${i}`];
            delete data[`productCategory${i}`];
            delete data[`productFeatures${i}`];
            delete data[`problemsSolved${i}`];
            delete data[`advantages${i}`];
            delete data[`price${i}`];
            delete data[`discount${i}`];
            delete data[`productAdjectives${i}`];
            delete data[`unsuitableCrowd${i}`];
            delete data[`productNotes${i}`];
        }
        
        // Add products array to data
        data.products = products;
        data.submittedAt = new Date().toISOString();
        
        // Save to localStorage
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            
            // Save questionnaire data with user ID for better organization
            if (currentUser && currentUser.id) {
                localStorage.setItem(`questionnaireData_${currentUser.id}`, JSON.stringify(data));
                console.log('Questionnaire data saved with user ID:', currentUser.id);
            }
            
            // Also save to global for backward compatibility
            localStorage.setItem('questionnaireData', JSON.stringify(data));
            console.log('Data saved to localStorage');
            
            // Show success message and redirect
            alert('Questionnaire submitted successfully! Redirecting to dashboard...');
            console.log('Redirecting to dashboard.html');
            
            // Force redirect after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 100);
            
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
        }
    });

    // Load saved data if exists
    try {
        const savedData = localStorage.getItem('questionnaireData');
        if (savedData) {
            const data = JSON.parse(savedData);
            populateForm(data);
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
});

// Function to populate form with saved data
function populateForm(data) {
    for (const key in data) {
        if (key === 'paymentMethods' && Array.isArray(data[key])) {
            data[key].forEach(value => {
                const checkbox = document.querySelector(`input[name="paymentMethods"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else if (key === 'products') {
            // Handle products separately if needed
            console.log('Products data loaded:', data[key]);
        } else {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = data[key];
                } else {
                    element.value = data[key] || '';
                }
            }
        }
    }
}

// Global function to test redirect
function testRedirect() {
    console.log('Testing redirect to dashboard...');
    window.location.href = 'dashboard.html';
}
