let products = [
  { name: "Samosa", price: 20, channel: "01", delay: 5, image: "/images/samosa.jpg", stock: 10 },
  { name: "Water Bottle", price: 15, channel: "02", delay: 3, image: "/images/water.jpg", stock: 15 },
  { name: "Tea", price: 10, channel: "03", delay: 2, image: "/images/tea.jpg", stock: 20 }
];
let isAdmin = false;

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  document.getElementById('loginSection').style.display = 'none';
  if (email === "admin@anjali.com" && password === "admin123") {
    isAdmin = true;
    document.getElementById('adminPanel').style.display = 'block';
    updateInventory();
  } else {
    document.getElementById('userSection').style.display = 'block';
    displayProducts();
  }
}

function displayProducts() {
  const productDiv = document.getElementById('products');
  productDiv.innerHTML = '';
  products.forEach(product => {
    if (product.stock > 0) {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `<img src="${product.image}" alt="${product.name}"><br>${product.name} - ${product.price} INR<br><button onclick="selectProduct('${product.name}', ${product.price}, '${product.channel}', ${product.delay})">Select</button>`;
      productDiv.appendChild(div);
    }
  });
}

function selectProduct(name, price, channel, delay) {
  const product = products.find(p => p.name === name);
  if (product.stock > 0) {
    document.getElementById('amount').textContent = price;
    document.getElementById('status').textContent = `Selected: ${name}. Please scan QR to pay.`;
    setTimeout(() => {
      document.getElementById('status').textContent = `Payment successful! Dispensing ${name} from channel ${channel}...`;
      setTimeout(() => {
        product.stock--;
        document.getElementById('status').textContent = `${name} dispensed. Stock left: ${product.stock}. Thank you!`;
        if (isAdmin) updateInventory();
        else displayProducts();
      }, delay * 1000);
    }, 2000);
  } else {
    document.getElementById('status').textContent = `${name} is out of stock!`;
  }
}

function updateInventory() {
  const inventoryDiv = document.getElementById('inventory');
  inventoryDiv.innerHTML = '<h3>Inventory Status</h3>';
  products.forEach(product => {
    inventoryDiv.innerHTML += `<p>${product.name}: ${product.stock} left</p>`;
  });
}

function addProduct() {
  const name = document.getElementById('newProductName').value;
  const price = parseInt(document.getElementById('newProductPrice').value);
  const channel = document.getElementById('newProductChannel').value;
  const delay = parseInt(document.getElementById('newProductDelay').value);
  const image = document.getElementById('newProductImage').value;
  if (name && price && channel && delay && image) {
    products.push({ name, price, channel, delay, image: `/images/${image}`, stock: 10 });
    updateInventory();
    alert(`${name} added successfully!`);
  }
}

function removeProduct() {
  const name = prompt("Enter product name to remove:");
  const index = products.findIndex(p => p.name === name);
  if (index !== -1) {
    products.splice(index, 1);
    updateInventory();
    alert(`${name} removed successfully!`);
  }
}