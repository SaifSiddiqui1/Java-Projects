class EcommerceApp {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.token = localStorage.getItem('authToken');
        this.currentUser = localStorage.getItem('currentUser');
        console.log("🛒 Ecommerce App Created");
    }

    init() {
        console.log("🚀 Initializing Ecommerce App...");
        this.loadProducts();
        this.setupAllEventListeners();
        this.updateCartCount();
        this.updateAuthUI();
        console.log("✅ Ecommerce App Ready!");
    }

    async loadProducts() {
        try {
            console.log("📦 Loading products from backend...");
            const response = await fetch('http://localhost:8080/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            this.products = await response.json();
            console.log('✅ Products loaded:', this.products.length);
            this.renderProducts();
        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.products = this.getSampleProducts();
            this.renderProducts();
        }
    }

    getSampleProducts() {
        return [
            { id: 1, name: "Wireless Headphones", price: 99.99, description: "High-quality wireless headphones", image: "🎧" },
            { id: 2, name: "Smartphone", price: 599.99, description: "Latest smartphone with advanced features", image: "📱" },
            { id: 3, name: "Laptop", price: 999.99, description: "Powerful laptop for work and gaming", image: "💻" },
            { id: 4, name: "Smart Watch", price: 199.99, description: "Feature-rich smartwatch", image: "⌚" },
            { id: 5, name: "Tablet", price: 399.99, description: "Versatile tablet for entertainment", image: "📱" },
            { id: 6, name: "Gaming Console", price: 499.99, description: "Next-gen gaming console", image: "🎮" }
        ];
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) {
            console.error('❌ Products grid element not found!');
            return;
        }
        
        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="app.addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `).join('');
        console.log('✅ Products rendered successfully');
    }

    // ========== AUTHENTICATION METHODS ==========
    setupAllEventListeners() {
        console.log("🔗 Setting up all event listeners...");

        // Login Button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log("🖱️ Login button clicked!");
                this.showModal('login-modal');
            });
            console.log("✅ Login button listener added");
        }

        // Register Button
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                console.log("🖱️ Register button clicked!");
                this.showModal('register-modal');
            });
            console.log("✅ Register button listener added");
        }

        // Logout Button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log("🖱️ Logout button clicked!");
                this.logout();
            });
        }

        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("📝 Login form submitted");
                this.handleLogin();
            });
        }

        // Register Form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("📝 Register form submitted");
                this.handleRegister();
            });
        }

        // Modal Close Buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                console.log("❌ Close button clicked for:", modalId);
                this.hideModal(modalId);
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log("🖱️ Clicked outside modal");
                    this.hideModal(modal.id);
                }
            });
        });

        // Cart Link
        const cartLink = document.querySelector('a[href="#cart"]');
        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("🛒 Cart link clicked");
                this.renderCart();
                this.showModal('cart-modal');
            });
        }

        // Checkout Button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                console.log("💰 Checkout button clicked");
                this.showPaymentModal();
            });
        }

        // Orders Link
        const ordersLink = document.getElementById('orders-link');
        if (ordersLink) {
            ordersLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("📦 Orders link clicked");
                this.loadUserOrders();
            });
        }

        // Payment Form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("💳 Payment form submitted");
                this.handlePayment();
            });
        }

        // Payment Method Change
        const paymentMethod = document.getElementById('payment-method');
        if (paymentMethod) {
            paymentMethod.addEventListener('change', (e) => {
                const cardDetails = document.getElementById('card-details');
                if (e.target.value === 'credit_card' || e.target.value === 'debit_card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        }

        // Order Success Buttons
        const viewOrdersBtn = document.getElementById('view-orders-btn');
        if (viewOrdersBtn) {
            viewOrdersBtn.addEventListener('click', () => {
                this.hideModal('order-success-modal');
                this.loadUserOrders();
            });
        }

        const continueShoppingBtn = document.getElementById('continue-shopping-btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                this.hideModal('order-success-modal');
            });
        }

        console.log("✅ All event listeners setup complete!");
    }

    // SIMPLE MODAL METHODS
    showModal(modalId) {
        console.log("🪟 Showing modal:", modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            console.log("✅ Modal shown successfully:", modalId);
        } else {
            console.error("❌ Modal not found:", modalId);
        }
    }

    hideModal(modalId) {
        console.log("🪟 Hiding modal:", modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // LOGIN HANDLER
    async handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showAuthMessage('login-message', 'Please fill in all fields', 'error');
            return;
        }

        console.log("🔐 Attempting login for user:", username);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log("📨 Login response:", data);

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.username;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', this.currentUser);
                
                this.hideModal('login-modal');
                this.updateAuthUI();
                this.showNotification('🎉 Login successful! Welcome back!');
                this.clearForm('login-form');
            } else {
                this.showAuthMessage('login-message', data.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showAuthMessage('login-message', 'Login failed. Please check if the backend server is running.', 'error');
        }
    }

    // REGISTER HANDLER
    async handleRegister() {
        const fullName = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!fullName || !username || !email || !password) {
            this.showAuthMessage('register-message', 'Please fill in all fields', 'error');
            return;
        }

        console.log("📝 Attempting registration for user:", username);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, username, email, password })
            });

            const data = await response.json();
            console.log("📨 Register response:", data);

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.username;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', this.currentUser);
                
                this.hideModal('register-modal');
                this.updateAuthUI();
                this.showNotification('🎉 Registration successful! Welcome to TechShop!');
                this.clearForm('register-form');
            } else {
                this.showAuthMessage('register-message', data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('❌ Register error:', error);
            this.showAuthMessage('register-message', 'Registration failed. Please check if the backend server is running.', 'error');
        }
    }

    logout() {
        console.log("🚪 Logging out user:", this.currentUser);
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        this.showNotification('👋 Logged out successfully!');
    }

    updateAuthUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userInfo = document.getElementById('user-info');
        const usernameDisplay = document.getElementById('username-display');

        if (!authButtons || !userInfo || !usernameDisplay) {
            console.error('❌ Auth UI elements not found!');
            return;
        }

        if (this.currentUser) {
            authButtons.style.display = 'none';
            userInfo.style.display = 'flex';
            usernameDisplay.textContent = `Welcome, ${this.currentUser}`;
            console.log("✅ Updated UI for logged-in user");
        } else {
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
            console.log("✅ Updated UI for logged-out user");
        }
    }

    showAuthMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `auth-message ${type}`;
            element.style.display = 'block';
            console.log(`📢 Auth message [${type}]: ${message}`);
        }
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
        // Clear messages
        const loginMsg = document.getElementById('login-message');
        const registerMsg = document.getElementById('register-message');
        if (loginMsg) loginMsg.textContent = '';
        if (registerMsg) registerMsg.textContent = '';
    }

    showNotification(message) {
        // Create a nice notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // ========== CART METHODS ==========
    addToCart(productId) {
        console.log("🛒 Adding product to cart:", productId);
        
        if (!this.currentUser) {
            this.showNotification('🔐 Please login to add items to your cart!');
            this.showModal('login-modal');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (product) {
            const existingItem = this.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.saveCart();
            this.updateCartCount();
            this.showNotification(`✅ ${product.name} added to cart!`);
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) {
            console.error('❌ Cart elements not found');
            return;
        }

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <div>
                    <button onclick="app.removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    // ========== PAYMENT & ORDERS METHODS ==========
    showPaymentModal() {
        if (!this.currentUser) {
            this.showNotification('🔐 Please login to proceed with payment!');
            this.showModal('login-modal');
            return;
        }

        if (this.cart.length === 0) {
            this.showNotification('🛒 Your cart is empty!');
            return;
        }

        this.renderOrderSummary();
        this.showModal('payment-modal');
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const orderTotalAmount = document.getElementById('order-total-amount');

        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotalAmount.textContent = total.toFixed(2);
    }

    async handlePayment() {
        const paymentMethod = document.getElementById('payment-method').value;
        const shippingAddress = document.getElementById('shipping-address').value;

        if (!paymentMethod || !shippingAddress) {
            this.showAuthMessage('payment-message', 'Please fill all required fields', 'error');
            return;
        }

        console.log("💳 Processing payment...");

        try {
            const orderItems = this.cart.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            const orderData = {
                paymentMethod: paymentMethod,
                shippingAddress: shippingAddress,
                items: orderItems
            };

            const response = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const order = await response.json();
                this.handleOrderSuccess(order);
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('❌ Payment error:', error);
            this.showAuthMessage('payment-message', 'Payment failed. Please try again.', 'error');
        }
    }

    handleOrderSuccess(order) {
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        
        // Hide payment modal
        this.hideModal('payment-modal');
        
        // Show success modal
        document.getElementById('success-order-id').textContent = order.id || '12345';
        document.getElementById('success-order-amount').textContent = order.totalAmount ? order.totalAmount.toFixed(2) : '0.00';
        this.showModal('order-success-modal');
        
        this.showNotification('🎉 Order placed successfully! Thank you for your purchase!');
    }

    async loadUserOrders() {
        if (!this.currentUser) {
            this.showNotification('🔐 Please login to view your orders!');
            return;
        }

        this.showModal('orders-modal');
        // For now, show a placeholder
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = `
            <div class="no-orders">
                <h3>Order History</h3>
                <p>Your order history will appear here once you place orders.</p>
                <button class="auth-btn" onclick="app.hideModal('orders-modal')">Continue Shopping</button>
            </div>
        `;
    }
}

// Initialize app when page loads
console.log("🛒 Loading Ecommerce App...");
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM fully loaded and ready");
    window.app = new EcommerceApp();
    window.app.init();
});