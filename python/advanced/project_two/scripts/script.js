/* --- E-COMMERCE LOGIC (Modern Class Structure) --- */

const SHIPPING_FEE = 15.00;
const STORAGE_KEY = 'minEcommerceCart';

// Simulação de Catálogo (Catálogo é um dado imutável)
const CATALOG = {
    101: { id: 101, name: "Python Book", price: 45.99 },
    102: { id: 102, name: "Flask Ebook", price: 29.50 },
    103: { id: 103, name: "Webcam", price: 120.00 },
    104: { id: 104, name: "Custom Mousepad", price: 15.00 }
};

/**
 * Gerencia o estado do carrinho de compras e a persistência via LocalStorage.
 */
class CartManager {
    constructor() {
        this.cart = this.loadCart() || {};
        this.shippingFee = SHIPPING_FEE;
    }

    // --- Persistence ---

    loadCart() {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Error loading cart from storage:", e);
            return {};
        }
    }

    saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
    }

    // --- Cart Actions ---

    addItem(productId) {
        const id = parseInt(productId);
        if (!CATALOG[id]) return;

        if (this.cart[id]) {
            this.cart[id].quantity += 1;
        } else {
            this.cart[id] = {
                product: CATALOG[id],
                quantity: 1
            };
        }
        this.saveCart();
    }

    updateQuantity(productId, change) {
        const id = parseInt(productId);
        if (!this.cart[id]) return;

        this.cart[id].quantity += change;

        if (this.cart[id].quantity <= 0) {
            delete this.cart[id];
        }
        this.saveCart();
    }

    removeItem(productId) {
        const id = parseInt(productId);
        delete this.cart[id];
        this.saveCart();
    }

    // --- Calculation ---

    getItemsArray() {
        // Retorna um array de itens para facilitar a renderização/cálculo
        return Object.values(this.cart);
    }

    calculateSubtotal() {
        // Usa o método reduce moderno para calcular o subtotal
        return this.getItemsArray().reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    calculateFinalTotal(subtotal) {
        return subtotal + this.shippingFee;
    }

    checkout() {
        if (Object.keys(this.cart).length === 0) {
            alert("O carrinho está vazio!");
            return false;
        }

        const confirmation = confirm("Deseja realmente finalizar a compra?");

        if (confirmation) {
            // Simulação de transação
            const total = this.calculateFinalTotal(this.calculateSubtotal());
            alert(`Compra de R$ ${total.toFixed(2)} realizada com sucesso!\nMemória do carrinho será limpa.`);
            this.cart = {}; // Limpa o carrinho
            this.saveCart();
            return true;
        }
        return false;
    }
}

// --- UI RENDER LOGIC ---

const cartManager = new CartManager();
const DOM = {
    productList: document.getElementById('product-list'),
    cartItemsDiv: document.getElementById('cart-items'),
    emptyMsg: document.getElementById('empty-cart-msg'),
    subtotalSpan: document.getElementById('subtotal'),
    shippingSpan: document.getElementById('shipping'),
    finalTotalSpan: document.getElementById('final-total'),
    checkoutBtn: document.getElementById('checkout-btn')
};

function attachGlobalListeners() {
    // Anexa listeners globais aos botões injetados dinamicamente
    DOM.productList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.getAttribute('data-id');
            if (e.target.classList.contains('add-to-cart')) {
                cartManager.addItem(id);
                render();
            }
        }
    });

    DOM.cartItemsDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.getAttribute('data-id');
            const action = e.target.getAttribute('data-action');
            
            if (action === 'add') cartManager.updateQuantity(id, 1);
            else if (action === 'remove') cartManager.updateQuantity(id, -1);
            else if (action === 'delete') cartManager.removeItem(id);
            
            render();
        }
    });
    
    DOM.checkoutBtn.addEventListener('click', () => {
        if (cartManager.checkout()) {
            render();
        }
    });
}

function renderCatalog() {
    DOM.productList.innerHTML = '';
    // Usa Object.values(CATALOG) para obter um array de produtos
    Object.values(CATALOG).forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <strong>${product.name}</strong>
            <div class="price">R$ ${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
        `;
        DOM.productList.appendChild(card);
    });
}

function renderCart() {
    const items = cartManager.getItemsArray();
    DOM.cartItemsDiv.innerHTML = ''; 

    if (items.length === 0) {
        DOM.emptyMsg.style.display = 'block';
        return;
    }
    DOM.emptyMsg.style.display = 'none';
    
    // Usa Array.prototype.map para construir o HTML de forma limpa
    const htmlItems = items.map(item => {
        const itemTotal = item.product.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.product.name} (${item.quantity}x)</div>
                    <div class="item-price">R$ ${item.product.price.toFixed(2)} cada | Total: R$ ${itemTotal.toFixed(2)}</div>
                </div>
                <div class="item-controls">
                    <button data-id="${item.product.id}" data-action="remove">-</button>
                    <button data-id="${item.product.id}" data-action="add">+</button>
                    <button data-id="${item.product.id}" data-action="delete">Remover</button>
                </div>
            </div>
        `;
    }).join(''); // Junta todos os strings em um só

    DOM.cartItemsDiv.innerHTML = htmlItems;
}

function renderSummary() {
    const subtotal = cartManager.calculateSubtotal();
    const finalTotal = cartManager.calculateFinalTotal(subtotal);
    
    DOM.subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    DOM.shippingSpan.textContent = `R$ ${cartManager.shippingFee.toFixed(2)}`;
    DOM.finalTotalSpan.textContent = `R$ ${finalTotal.toFixed(2)}`;
}

/**
 * Função principal de renderização que atualiza toda a UI.
 */
function render() {
    renderCart();
    renderSummary();
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    attachGlobalListeners();
    render(); // Primeira renderização completa da UI
});