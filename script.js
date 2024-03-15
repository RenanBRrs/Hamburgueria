const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkouBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

// Abre modal
cartBtn?.addEventListener('click', function () {
  updateCartModal();
  cartModal.style.display = 'flex';
});

// Fecha modal
cartModal?.addEventListener('click', function (e) {
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

closeModalBtn?.addEventListener('click', function () {
  cartModal.style.display = 'none';
});

menu?.addEventListener('click', function (e) {
  let parentButton = e.target.closest('.add-to-cart-btn');
  if (parentButton) {
    const name = parentButton.getAttribute('data-name');
    const price = parseFloat(parentButton.getAttribute('data-price'));

    addToCart(name, price);
  }
});

// Função add no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza o cart
function updateCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    const carItemElement = document.createElement('div');
    carItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

    carItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2" >R$: ${item.price.toFixed(2)}</p>
      </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
    </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer?.appendChild(carItemElement);
  });

  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  cartCounter.innerHTML = cart.length;
}

// Remover do carrinho
cartItemsContainer?.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-from-cart-btn')) {
    const name = e.target.getAttribute('data-name');

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput?.addEventListener('input', function (e) {
  let inputValeu = e.target.value;

  if (inputValeu !== '') {
    addressInput.classList.remove('border-red-500');
    addressWarn?.classList.add('hidden');
  }
});

checkouBtn.addEventListener('click', function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: 'Ops o restaurante está fechado!',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden');
    addressInput?.classList.add('border-red-500');
    return;
  }
  // Envia Zap
  const cartItems = cart
    .map((i) => {
      return `${i.name} Quantidade ${i.quantity} Preço: R$${i.price} |`;
    })
    .join('');

  const message = encodeURIComponent(cartItems);
  // NUMERO AQUI
  const phone = 'numero aqui';

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    '_blank',
  );

  cart = [];
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 19 && hora < 23;
}

const spanItem = document.getElementById('date-span');
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem?.classList.remove('bg-red-500');
  spanItem?.classList.add('bg-green-600');
} else {
  spanItem?.classList.remove('bg-green-600');
  spanItem?.classList.add('bg-red-500');
}
