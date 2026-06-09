import './style.css';

const fades = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
});

fades.forEach(item => observer.observe(item));

let cart = [];

const cartBtn = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountBadge = document.querySelector('.cart-count');
const cartTotalDisplay = document.getElementById('cart-total');

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCountBadge.textContent = '0';
        cartTotalDisplay.textContent = '$0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">
                <span>Size: ${item.size}</span>
                <span class="cart-item-price">$${item.price}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                <button class="remove-item" data-index="${index}">✕</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotalDisplay.textContent = '$' + total;
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const action = e.target.dataset.action;
            
            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease') {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                }
            }
            updateCartUI();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartUI();
        });
    });
}

const expandBtns = document.querySelectorAll('.expand-btn');
expandBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        card.classList.toggle('expanded');
        btn.classList.toggle('active');
    });
});

const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const allSizeBtns = card.querySelectorAll('.size-btn');
        allSizeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

const addToCartBtns = document.querySelectorAll('.add-to-cart');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const selectedSize = card.querySelector('.size-btn.selected');
        const productName = card.querySelector('h3').textContent;
        const productPrice = 39;
        
        if (selectedSize) {
            const size = selectedSize.textContent;
            const existingItem = cart.find(item => item.name === productName && item.size === size);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    size: size,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            updateCartUI();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        } else {
            alert('Please select a size first');
        }
    });
});

const tshirt = document.querySelector('.tshirt-card');
const heroImage = document.querySelector('.hero-image');
let isDragging = false;
let pointerStartX = 0;
let pointerStartY = 0;
let currentX = 10;
let rotationY = 0;

if (heroImage && tshirt) {
    heroImage.addEventListener('pointerdown', (event) => {
        isDragging = true;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        heroImage.setPointerCapture(event.pointerId);
        tshirt.style.animationPlayState = 'paused';
        tshirt.style.transition = 'transform .1s ease';
    });

    heroImage.addEventListener('pointermove', (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - pointerStartX;
        const deltaY = event.clientY - pointerStartY;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;

        rotationY += deltaX * 0.35;
        currentX = Math.max(-25, Math.min(25, currentX - deltaY * 0.18));

        tshirt.style.transform = `translateY(-10px) rotateX(${currentX}deg) rotateY(${rotationY}deg)`;
    });

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        tshirt.style.animationPlayState = 'running';
        tshirt.style.transition = 'transform .75s ease';
        tshirt.style.transform = `translateY(-10px) rotateX(${currentX}deg) rotateY(${rotationY}deg)`;
    };

    heroImage.addEventListener('pointerup', stopDrag);
    heroImage.addEventListener('pointerleave', stopDrag);

    heroImage.addEventListener('mouseenter', () => {
        if (tshirt) tshirt.style.animationPlayState = 'paused';
    });

    heroImage.addEventListener('mouseleave', () => {
        if (!isDragging) {
            tshirt.style.animationPlayState = 'running';
            tshirt.style.transform = '';
        }
    });
}

const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterMessage = document.getElementById('newsletter-message');
const subscribeBtn = newsletterForm.querySelector('button');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterEmail.value.trim();
        if (!email) {
            showNewsletterMessage('Please enter a valid email', 'error');
            return;
        }
        
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Subscribing...';
        
        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNewsletterMessage('✓ ' + data.message, 'success');
                newsletterEmail.value = '';
                subscribeBtn.textContent = 'Subscribe';
            } else {
                showNewsletterMessage('✕ ' + data.message, 'error');
                subscribeBtn.disabled = false;
                subscribeBtn.textContent = 'Subscribe';
            }
        } catch (error) {
            showNewsletterMessage('✕ Connection error. Please try again.', 'error');
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = 'Subscribe';
        }
    });
}

function showNewsletterMessage(message, type) {
    newsletterMessage.textContent = message;
    newsletterMessage.className = `newsletter-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            newsletterMessage.className = 'newsletter-message';
        }, 5000);
    }
}
