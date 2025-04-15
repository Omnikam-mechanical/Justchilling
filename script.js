// === GLOBAL STATE ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let designCart = JSON.parse(localStorage.getItem('designCart')) || [];

const elements = {
  cartCounter: document.getElementById('cart-counter'),
  cartList: document.getElementById('cart-list'),
  cartTotal: document.getElementById('cart-total'),
  cartModal: document.getElementById('cart-modal'),
  closeButton: document.getElementById('close-cart-modal'),
  cartButton: document.getElementById('cart-button'),
  checkoutButtonRazorpay: document.querySelector('.checkout-button-razorpay'),
  productGrid: document.getElementById('product-grid'),
  designUpload: document.getElementById('designUpload'),
  textInput: document.getElementById('textAdd'),
  previewImage: document.getElementById('previewImage'),
  previewText: document.getElementById('previewText'),
  previewButton: document.querySelector('.live-preview-btn'),
  addToCartButton: document.querySelector('.add-to-cart-btn'),
  bulkOrderForm: document.getElementById('bulkOrderForm')
};

const products = [
  { id: 1, name: 'Casual T-Shirt', price: 599, image: '1.jpg' },
  { id: 2, name: 'Formal Shirt', price: 999, image: '2.jpg' },
  { id: 3, name: 'Graphic Tee', price: 699, image: '3.jpg' }
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('designCart', JSON.stringify(designCart));
}

function calculateTotal() {
  return [...cart, ...designCart].reduce((sum, item) => sum + item.price, 0);
}

function updateCartUI() {
  elements.cartCounter.innerText = cart.length + designCart.length;
  elements.cartList.innerHTML = '';
  [...cart, ...designCart].forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name || 'Custom Design'} - ₹${item.price}
      <button onclick="removeFromCart(${index}, '${item.name ? 'product' : 'design'}')">Remove</button>
    `;
    elements.cartList.appendChild(li);
  });
  elements.cartTotal.innerText = `Total: ₹${calculateTotal()}`;
  saveToStorage();
}

function addToCart(product) {
  if (!cart.find(p => p.id === product.id)) {
    cart.push(product);
    updateCartUI();
  } else {
    alert('Item already in cart!');
  }
}

function removeFromCart(index, type) {
  if (type === 'product') {
    cart.splice(index, 1);
  } else {
    designCart.splice(index - cart.length, 1);
  }
  updateCartUI();
}

function displayProducts() {
  elements.productGrid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
    `;
    elements.productGrid.appendChild(card);
  });
}

// Modal Control
elements.cartButton.addEventListener('click', () => {
  elements.cartModal.style.display = 'block';
  updateCartUI();
});

elements.closeButton.addEventListener('click', () => {
  elements.cartModal.style.display = 'none';
});

// Custom Design Preview & Add
elements.previewButton.addEventListener('click', () => {
  const file = elements.designUpload.files[0];
  const text = elements.textInput.value.trim();
  elements.previewText.textContent = text;

  if (file) {
    const reader = new FileReader();
    reader.onload = e => elements.previewImage.src = e.target.result;
    reader.readAsDataURL(file);
  } else {
    elements.previewImage.src = '';
  }
});

elements.addToCartButton.addEventListener('click', () => {
  const image = elements.previewImage.src;
  const text = elements.previewText.textContent;

  if (!image) {
    alert("Please preview a design first.");
    return;
  }

  designCart.push({ image, text, price: 599 });
  resetPreview();
  updateCartUI();
  alert('Custom design added to cart!');
});

function resetPreview() {
  elements.designUpload.value = '';
  elements.textInput.value = '';
  elements.previewImage.src = '';
  elements.previewText.textContent = '';
}

// Razorpay Integration
elements.checkoutButtonRazorpay.addEventListener('click', () => {
  if (cart.length + designCart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const total = calculateTotal();

  const options = {
    key: 'rzp_test_YourTestKeyHere',
    amount: total * 100,
    currency: 'INR',
    name: 'JustChilling',
    description: 'T-Shirt Purchase',
    handler: function (response) {
      alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      cart = [];
      designCart = [];
      saveToStorage();
      updateCartUI();
    },
    theme: { color: '#28a745' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

// Bulk Order Form Validation
if (elements.bulkOrderForm) {
  elements.bulkOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.bulkOrderForm.querySelector('#bulkEmail').value;
    const message = elements.bulkOrderForm.querySelector('#bulkMessage').value;
    const emailError = document.getElementById('bulkEmailError');
    const messageError = document.getElementById('bulkMessageError');

    let valid = true;
    emailError.style.display = 'none';
    messageError.style.display = 'none';

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      emailError.textContent = 'Invalid email.';
      emailError.style.display = 'block';
      valid = false;
    }
    if (!message.trim()) {
      messageError.textContent = 'Message cannot be empty.';
      messageError.style.display = 'block';
      valid = false;
    }

    if (valid) {
      alert('Bulk inquiry sent!');
      elements.bulkOrderForm.reset();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  updateCartUI();
});
