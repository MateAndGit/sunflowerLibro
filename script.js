const categories = [
  { id: 1, name: "Novela Histórica" },
  { id: 2, name: "Ficción y Literatura" },
  { id: 3, name: "Misterio y Suspenso" },
  { id: 4, name: "Fantasía y Ciencia Ficción" },
  { id: 5, name: "Biografías y Corrientes" },
  { id: 6, name: "Poesía y Drama" },
  { id: 7, name: "Desarrollo Personal" },
  { id: 8, name: "Infantil y Juvenil" },
  { id: 9, name: "Filosofía y Humanidades" },
  { id: 10, name: "Arte y Fotografía" },
];

const products = [
  {
    id: 1,
    image: "images/book-test.png",
    title: "El Principito",
    price: 15000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 2,
    image: "images/book-test.png",
    title: "Cien años de soledad",
    price: 24500,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 3,
    image: "images/book-test.png",
    title: "Ficciones",
    price: 18000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 4,
    image: "images/book-test.png",
    title: "Rayuela",
    price: 22000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 5,
    image: "images/book-test.png",
    title: "El túnel",
    price: 13500,
    category: "Misterio y Suspenso",
    amount: 0,
  },
  {
    id: 6,
    image: "images/book-test.png",
    title: "Don Quijote de la Mancha",
    price: 29000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 7,
    image: "images/book-test.png",
    title: "La casa de los espíritus",
    price: 21000,
    category: "Novela Histórica",
    amount: 0,
  },
  {
    id: 8,
    image: "images/book-test.png",
    title: "Pedro Páramo",
    price: 12000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 9,
    image: "images/book-test.png",
    title: "Crónica de una muerte anunciada",
    price: 16500,
    category: "Misterio y Suspenso",
    amount: 0,
  },
  {
    id: 10,
    image: "images/book-test.png",
    title: "El amor en los tiempos del cólera",
    price: 23000,
    category: "Ficción y Literatura",
    amount: 0,
  },
  {
    id: 11,
    image: "images/book-test.png",
    title: "Veinte poemas de amor y una canción desesperada",
    price: 11000,
    category: "Poesía y Drama",
    amount: 0,
  },
  {
    id: 12,
    image: "images/book-test.png",
    title: "La sombra del viento",
    price: 26000,
    category: "Misterio y Suspenso",
    amount: 0,
  },
  {
    id: 13,
    image: "images/book-test.png",
    title: "El laberinto de los espíritus",
    price: 27500,
    category: "Misterio y Suspenso",
    amount: 0,
  },
  {
    id: 14,
    image: "images/book-test.png",
    title: "La catedral del mar",
    price: 25000,
    category: "Novela Histórica",
    amount: 0,
  },
  {
    id: 15,
    image: "images/book-test.png",
    title: "El código Da Vinci",
    price: 19500,
    category: "Misterio y Suspenso",
    amount: 0,
  },
  {
    id: 16,
    image: "images/book-test.png",
    title: "Fahrenheit 451",
    price: 15500,
    category: "Fantasía y Ciencia Ficción",
    amount: 0,
  },
  {
    id: 17,
    image: "images/book-test.png",
    title: "Crónicas marcianas",
    price: 14000,
    category: "Fantasía y Ciencia Ficción",
    amount: 0,
  },
  {
    id: 18,
    image: "images/book-test.png",
    title: "El Hobbit",
    price: 21500,
    category: "Fantasía y Ciencia Ficción",
    amount: 0,
  },
  {
    id: 19,
    image: "images/book-test.png",
    title: "Diario de Ana Frank",
    price: 13000,
    category: "Biografías y Corrientes",
    amount: 0,
  },
  {
    id: 20,
    image: "images/book-test.png",
    title: "Steve Jobs",
    price: 28000,
    category: "Biografías y Corrientes",
    amount: 0,
  },
  {
    id: 21,
    image: "images/book-test.png",
    title: "Antología Poética",
    price: 12500,
    category: "Poesía y Drama",
    amount: 0,
  },
  {
    id: 22,
    image: "images/book-test.png",
    title: "Bodas de sangre",
    price: 11500,
    category: "Poesía y Drama",
    amount: 0,
  },
  {
    id: 23,
    image: "images/book-test.png",
    title: "El poder de los hábitos",
    price: 18500,
    category: "Desarrollo Personal",
    amount: 0,
  },
  {
    id: 24,
    image: "images/book-test.png",
    title: "Hábitos atómicos",
    price: 19000,
    category: "Desarrollo Personal",
    amount: 0,
  },
  {
    id: 25,
    image: "images/book-test.png",
    title: "Harry Potter y la piedra filosofal",
    price: 20000,
    category: "Infantil y Juvenil",
    amount: 0,
  },
  {
    id: 26,
    image: "images/book-test.png",
    title: "El principito ilustrado",
    price: 17000,
    category: "Infantil y Juvenil",
    amount: 0,
  },
  {
    id: 27,
    image: "images/book-test.png",
    title: "Así habló Zaratustra",
    price: 16000,
    category: "Filosofía y Humanidades",
    amount: 0,
  },
  {
    id: 28,
    image: "images/book-test.png",
    title: "El banquete",
    price: 13000,
    category: "Filosofía y Humanidades",
    amount: 0,
  },
  {
    id: 29,
    image: "images/book-test.png",
    title: "Historia del Arte",
    price: 32000,
    category: "Arte y Fotografía",
    amount: 0,
  },
  {
    id: 30,
    image: "images/book-test.png",
    title: "Gernika: Pintura y Poder",
    price: 29500,
    category: "Arte y Fotografía",
    amount: 0,
  },
];

const $pointer = document.getElementById("cursor__pointer");
const $inner__eyes = document.getElementsByClassName("inner__eye");

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let eyeX = 0;
let eyeY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  if ($pointer) $pointer.style.translate = `${cursorX}px ${cursorY}px`;

  const targetEyeX = mouseX - window.innerWidth / 2;
  const targetEyeY = mouseY - window.innerHeight / 2;

  eyeX += (targetEyeX - eyeX) * 0.1;
  eyeY += (targetEyeY - eyeY) * 0.1;

  const limitedX = Math.max(-15, Math.min(15, eyeX * 0.05));
  const limitedY = Math.max(-15, Math.min(15, eyeY * 0.05));

  for (const $eye of $inner__eyes) {
    $eye.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

// const $cursor = document.getElementById("cursor");
// const $intro = document.getElementById("intro");
// const $mainSections = document.getElementById("main__sections");

// if ($intro) {
//   $intro.addEventListener(
//     "click",
//     () => {
//       $intro.classList.add("exit");
//       if ($cursor) $cursor.classList.add("hidden");
//       if ($mainSections) $mainSections.classList.remove("hidden");
//     },
//     { once: true },
//   );

//   $intro.addEventListener("animationend", () => {
//     $intro.style.display = "none";
//   });
// }

const $countNum = document.getElementById("count__num");
let cartList = [];

function cartCountUpdated() {
  $countNum.textContent = cartList.length;
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);

  if (!product) return;

  let count = 0;
  const isDuplicated = cartList.find((p) => p.id === id);

  if (isDuplicated) {
    console.log("변경 전:", product.amount);
    isDuplicated.amount++;
    console.log("변경 후:", product.amount);
  } else {
    const newCartItem = { ...product, amount: 1 };
    cartList.unshift(newCartItem);
  }
  cartCountUpdated();
  alert(`${product.title}을 담았습니다.`);
}
const $cartWrapper = document.getElementById("cart-wrapper");
const $modal = document.getElementById("modal-overlay");
const $modalClose = document.getElementById("modal__close");
const $cartListModal = document.getElementById("cart__list");

function openModal() {
  $modal.style.display = "flex";
  document.body.classList.add("no-scroll");
}

function closeModal() {
  $modal.style.display = "none";
  document.body.classList.remove("no-scroll");
}

function minusBtn(btn, id) {
  const container = btn.closest(".list__container");

  const currentInput = container.querySelector(".quantity-input");
  const currentPrice = container.querySelector(".quantity-price");
  const product = cartList.find((c) => c.id === id);
  if (!product) {
    return;
  }
  let number = Number(currentInput.value);
  // if (number < 1) {
  //   if (confirm("상품을 삭제 하시겠습니까?")) {
  //     // cartList.pop();
  //   }
  //   number = 1;
  // }
  if (number > 1) {
    number--;
    currentInput.value = number;
    product.amount = number;
    currentPrice.textContent = `$${(product.price * number).toLocaleString()}`;
    updatePrice();
  }
}
function plusBtn(btn, id) {
  const container = btn.closest(".list__container");

  const currentInput = container.querySelector(".quantity-input");
  const currentPrice = container.querySelector(".quantity-price");
  const product = cartList.find((c) => c.id === id);
  if (!product) {
    return;
  }
  let number = Number(currentInput.value);
  if (number >= 10) {
    alert("10개 이상은 구입이 불가능해요 ㅠㅠ");
    return;
  }

  number++;
  currentInput.value = number;
  product.amount = number;
  currentPrice.textContent = `$${(product.price * number).toLocaleString()}`;
  updatePrice();
}

const $totalPrice = document.getElementById("total__price");

function updatePrice() {
  let totalPirce = 0;
  cartList.forEach((c) => {
    totalPirce += c.price * c.amount;
  });
  $totalPrice.textContent = `Total: $${totalPirce.toLocaleString()}`;
}

const $listDelete = document.getElementById("list__delete");

function listDelete(id) {
  cartList = cartList.filter((c) => c.id !== id);
  updatePrice();
  renderList();
  cartCountUpdated();
}

function renderList() {
  if (cartList.length === 0) {
    $cartListModal.innerHTML = `
      <div class="cart__list empty">
        <h1>El carrito de compras está vacío.</h1>
      </div>
    `;
    return;
  }
  $cartListModal.innerHTML = cartList
    .map(
      (list) => `
      <div class="list__container">
        <div class="list__img-area">
          <img src="${list.image}" alt="${list.title}"/>
        </div>
        <div class="list__title-amount">
          <h1 class="list__title">${list.title}</h1>
          <div class="quantity-picker">
            <button class="btn-minus" onclick="minusBtn(this,${list.id})">-</button>
            <input class="quantity-input" type="number" value="${list.amount}" min="1" max="99" readonly/>
            <button class="btn-plus" onclick="plusBtn(this,${list.id})">+</button>
          </div>
        </div>
        <div class="list__delete-price">
          <div id="list__delete" class="list__delete-area" onclick="listDelete(${list.id})">
            <img src="images/delete.png" alt="delete"/>
          </div>
          <p class="quantity-price">$${(list.price * list.amount).toLocaleString()}</p>
        </div>
      </div>
        
    `,
    )
    .join("");
  updatePrice();
}

$cartWrapper.addEventListener("click", () => {
  openModal();
  renderList();
});

$modal.addEventListener("click", (e) => {
  if (e.target === $modal || e.target === $modalClose) {
    closeModal();
  }
});

const $cardContainer = document.getElementById("card__container");

function bookList(name) {
  if (!$cardContainer) return;

  const filteredProducts = products.filter((p) =>
    name ? p.category === name : true,
  );

  $cardContainer.innerHTML = filteredProducts
    .map(
      (p) => `
          <div class="card">
              <img class="card__img-area" src="${p.image}" alt="${p.title}"/>
            <div class="card__title">
              <h1>${p.title}</h1>
            </div>
            <div class="card__price">
              <p>$${p.price.toLocaleString()}</p>
            </div>
            <div class="card__btns">
              <button onclick="addToCart(${p.id})">COMPRAR</button>
              <button>VER</button>
            </div>
          </div>
    `,
    )
    .join("");
}

const $category = document.getElementById("category");

function bookCategoryLoad() {
  if (!$category) return;

  $category.innerHTML = categories
    .map(
      (c) => `
          <div class="category__area">
            <span onclick="bookList('${c.name}')">${c.name}</span>
          </div>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  bookCategoryLoad();
  bookList();
});
