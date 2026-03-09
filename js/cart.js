/**
 * THE BREW HAVEN — cart.js
 * Full cart state management with localStorage persistence
 */

'use strict';

const Cart = (() => {

    const STORAGE_KEY = 'brewHavenCart';

    // ─── State ───
    let items = load();

    // ─── Persist ───
    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { }
        emit();
    }

    function load() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
    }

    // ─── Event system ───
    const listeners = [];
    function on(fn) { listeners.push(fn); }
    function emit() { listeners.forEach(fn => fn(items)); }

    // ─── Public API ───
    function add(product, qty = 1) {
        const existing = items.find(i => i.id === product.id);
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                shortName: product.shortName,
                price: product.price,
                weight: product.weight,
                image: product.image,
                qty,
            });
        }
        save();
        showCartNotification(product.shortName);
    }

    function remove(id) {
        items = items.filter(i => i.id !== id);
        save();
    }

    function updateQty(id, qty) {
        const item = items.find(i => i.id === id);
        if (!item) return;
        if (qty <= 0) { remove(id); return; }
        item.qty = qty;
        save();
    }

    function clear() { items = []; save(); }

    function getItems() { return [...items]; }

    function getCount() { return items.reduce((s, i) => s + i.qty, 0); }

    function getSubtotal() { return items.reduce((s, i) => s + i.price * i.qty, 0); }

    // ─── Cart Notification ───
    function showCartNotification(name) {
        let notif = document.getElementById('cartNotif');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'cartNotif';
            notif.className = 'cart-notif';
            document.body.appendChild(notif);
        }
        notif.textContent = `✓ ${name} added to bag`;
        notif.classList.add('show');
        clearTimeout(notif._timer);
        notif._timer = setTimeout(() => notif.classList.remove('show'), 2800);
    }

    // ─── Cart Drawer DOM ───
    function initDrawer() {
        if (document.getElementById('cartDrawer')) return;

        const drawer = document.createElement('div');
        drawer.id = 'cartDrawer';
        drawer.className = 'cart-drawer';
        drawer.innerHTML = `
      <div class="cart-backdrop" id="cartBackdrop"></div>
      <div class="cart-panel">
        <div class="cart-header">
          <h2 class="cart-title">Your Bag <span class="cart-count-label" id="cartCountLabel"></span></h2>
          <button class="cart-close" id="cartCloseBtn" aria-label="Close cart">✕</button>
        </div>
        <div class="cart-items" id="cartItemsList"></div>
        <div class="cart-footer" id="cartFooter">
          <div class="cart-subtotal-row">
            <span>Subtotal</span>
            <span id="cartSubtotal">₹ 0</span>
          </div>
          <p class="cart-shipping-note">Free shipping on orders above ₹ 999 · Usually ships in 2-3 days</p>
          <button class="btn-gold cart-checkout-btn" onclick="alert('Checkout coming soon! Thank you for shopping with The Brew Haven.')">PROCEED TO CHECKOUT</button>
          <button class="cart-continue" id="cartContinueBtn">← Continue Shopping</button>
        </div>
        <div class="cart-empty" id="cartEmpty">
          <div class="cart-empty-icon">☕</div>
          <p>Your bag is empty.</p>
          <p class="cart-empty-sub">Add some coffee to get started.</p>
        </div>
      </div>
    `;
        document.body.appendChild(drawer);

        document.getElementById('cartBackdrop').addEventListener('click', closeCart);
        document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
        document.getElementById('cartContinueBtn').addEventListener('click', closeCart);
    }

    function renderDrawer() {
        const list = document.getElementById('cartItemsList');
        const footer = document.getElementById('cartFooter');
        const empty = document.getElementById('cartEmpty');
        const countLbl = document.getElementById('cartCountLabel');
        const subtotalEl = document.getElementById('cartSubtotal');
        if (!list) return;

        const count = getCount();
        if (countLbl) countLbl.textContent = count > 0 ? `(${count})` : '';

        if (items.length === 0) {
            list.innerHTML = '';
            if (footer) footer.style.display = 'none';
            if (empty) empty.style.display = 'flex';
            return;
        }

        if (footer) footer.style.display = 'block';
        if (empty) empty.style.display = 'none';

        list.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${getImagePath(item.image)}" alt="${item.shortName}" loading="lazy" />
        </div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.shortName}</p>
          <p class="cart-item-weight">${item.weight}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">₹ ${(item.price * item.qty).toLocaleString('en-IN')}</span>
          <button class="cart-remove" onclick="Cart.remove('${item.id}')" aria-label="Remove">✕</button>
        </div>
      </div>
    `).join('');

        if (subtotalEl) subtotalEl.textContent = `₹ ${getSubtotal().toLocaleString('en-IN')}`;
    }

    // Resolve image path from any page depth
    function getImagePath(path) {
        // If we're in a subdirectory (pages/), prepend ../
        if (window.location.pathname.includes('/pages/')) {
            return '../' + path;
        }
        return path;
    }

    function openCart() {
        initDrawer();
        renderDrawer();
        document.getElementById('cartDrawer').classList.add('open');
        document.body.classList.add('cart-open');
    }

    function closeCart() {
        const drawer = document.getElementById('cartDrawer');
        if (drawer) drawer.classList.remove('open');
        document.body.classList.remove('cart-open');
    }

    // Listen for changes and auto-update
    on(() => {
        updateNavBadge();
        if (document.getElementById('cartDrawer')?.classList.contains('open')) {
            renderDrawer();
        }
    });

    function updateNavBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = getCount();
        badges.forEach(b => {
            b.textContent = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // Initialize on DOM ready
    function init() {
        initDrawer();
        updateNavBadge();

        // Hook all "ADD TO BAG" buttons — show quantity picker first
        document.addEventListener('click', (e) => {
            // If qty picker number clicked
            const qtyChoice = e.target.closest('[data-qty-choice]');
            if (qtyChoice) {
                e.stopPropagation();
                const qty = parseInt(qtyChoice.dataset.qtyChoice, 10);
                const picker = qtyChoice.closest('.qty-picker-inline');
                const id = picker.dataset.productId;
                const product = PRODUCTS.find(p => p.id === id);
                if (product) {
                    add(product, qty);
                    // Restore button
                    const container = picker.parentElement;
                    picker.remove();
                    const restored = document.createElement('button');
                    restored.className = picker.dataset.btnClass || 'btn-gold card-btn';
                    restored.setAttribute('data-add-to-cart', id);
                    restored.innerHTML = `<span class="btn-added-check">✓</span> ADDED (${qty})`;
                    restored.style.background = 'var(--accent)';
                    restored.style.color = 'var(--bg)';
                    container.appendChild(restored);
                    setTimeout(() => {
                        restored.innerHTML = 'ADD TO BAG';
                        restored.style.background = '';
                        restored.style.color = '';
                    }, 2000);
                }
                return;
            }

            // If main ADD TO BAG button clicked — show qty picker
            const btn = e.target.closest('[data-add-to-cart]');
            if (!btn) return;
            // Don't re-trigger if already showing picker
            if (btn.classList.contains('picking-qty')) return;
            const id = btn.dataset.addToCart;
            if (!PRODUCTS.find(p => p.id === id)) return;

            // Build the inline qty picker
            const pickerEl = document.createElement('div');
            pickerEl.className = 'qty-picker-inline';
            pickerEl.dataset.productId = id;
            pickerEl.dataset.btnClass = btn.className;
            pickerEl.innerHTML = `
                <span class="qty-picker-label">Qty:</span>
                <button class="qty-choice-btn" data-qty-choice="1">1</button>
                <button class="qty-choice-btn" data-qty-choice="2">2</button>
                <button class="qty-choice-btn" data-qty-choice="3">3</button>
                <button class="qty-choice-close" title="Cancel">✕</button>
            `;
            // Replace button with picker in-place
            const parent = btn.parentElement;
            btn.style.display = 'none';
            btn.classList.add('picking-qty');
            parent.appendChild(pickerEl);

            // Cancel button
            pickerEl.querySelector('.qty-choice-close').addEventListener('click', (ev) => {
                ev.stopPropagation();
                pickerEl.remove();
                btn.style.display = '';
                btn.classList.remove('picking-qty');
            });

            // Auto-close if clicked outside after 5s
            const autoClose = setTimeout(() => {
                if (document.contains(pickerEl)) {
                    pickerEl.remove();
                    btn.style.display = '';
                    btn.classList.remove('picking-qty');
                }
            }, 5000);

            pickerEl.addEventListener('click', () => clearTimeout(autoClose));
        });

        // Hook cart icon clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cartIconBtn') || e.target.closest('.nav-cart-btn')) {
                openCart();
            }
        });
    }

    return { add, remove, updateQty, clear, getItems, getCount, getSubtotal, openCart, closeCart, on, init, updateNavBadge };
})();

// Auto-init after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Cart.init);
} else {
    Cart.init();
}
