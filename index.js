let cart = [];

fetch("https://dummyjson.com/products?limit=4")
  .then((res) => res.json())
  .then((data) => {
    cart = data.products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      thumbnail: product.thumbnail,
    }));

    renderCart();
  })
  .catch((err) => console.error(err));

const cartList = document.getElementById("cartList");
const uniqueCount = document.getElementById("uniqueCount");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");

function renderCart(filteredCart = cart) {
  cartList.innerHTML = "";

  filteredCart.forEach((product) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <div class="cart-item-details">
        <h3>${product.title}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">${product.quantity}</span>
          <button class="increase">+</button>
          <button class="delete-btn">x</button>
        </div>
        <p>Total: $<span class="total">${(
          product.price * product.quantity
        ).toFixed(2)}</span></p>
      </div>
    `;

    const increaseBtn = li.querySelector(".increase");
    const decreaseBtn = li.querySelector(".decrease");
    const deleteBtn = li.querySelector(".delete-btn");
    const quantitySpan = li.querySelector(".quantity");
    const totalSpan = li.querySelector(".total");

    increaseBtn.addEventListener("click", () => {
      product.quantity += 1;
      quantitySpan.textContent = product.quantity;
      totalSpan.textContent = (product.price * product.quantity).toFixed(2);
      updateSummary();
    });

    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 1) {
        product.quantity -= 1;
        quantitySpan.textContent = product.quantity;
        totalSpan.textContent = (product.price * product.quantity).toFixed(2);
      } else {
        cart = cart.filter((p) => p.id !== product.id);
        li.remove();
      }
      updateSummary();
    });

    deleteBtn.addEventListener("click", () => {
      cart = cart.filter((p) => p.id !== product.id);
      li.remove();
      updateSummary();
    });

    cartList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  uniqueCount.textContent = cart.length;
  const totalQty = cart.reduce((acc, p) => acc + p.quantity, 0);
  const totalPrc = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  totalQuantity.textContent = totalQty;
  totalPrice.textContent = totalPrc.toFixed(2);
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCart = cart.filter((p) =>
    p.title.toLowerCase().includes(searchTerm)
  );
  renderCart(filteredCart);
});

refreshBtn.addEventListener("click", () => location.reload());

renderCart();
