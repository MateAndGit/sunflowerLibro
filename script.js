const $pointer = document.getElementById("cursor__pointer");
const $inner__eyes = document.getElementsByClassName("inner__eye");

// 🔥 핵심: 초기 시작 좌표를 0이 아니라 화면의 정중앙 좌표로 설정합니다.
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

// 눈동자 위치 변수 초기화
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

const MY_URL = "https://zwyuatfvkchspjtskcff.supabase.co";
const MY_KEY = "sb_publishable_Z76E40NfSGLSU1LWNlKzFQ_kvezPIsW";
const indexSupabase = window.supabase.createClient(MY_URL, MY_KEY);

let products = [];
async function bookList() {
  if (!$cardContainer) return;

  const { data, error } = await indexSupabase
    .from("books")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("데이터 로드 실패:", error);
    return;
  }

  products = data;
  if (data.length === 0) {
    grid.innerHTML = "등록된 책이 없습니다.";
    return;
  }
  $cardContainer.innerHTML = data
    .map(
      (book) => `
          <div class="card">
              <img src="${book.image_url}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x250?text=No+Image'">
            <div class="card__title">
              <h1>${book.title}</h1>
            </div>
            <div class="card__price">
              <p>$${book.price.toLocaleString()}</p>
            </div>
            <div class="card__btns">
              <button onclick="addToCart(${book.id})">COMPRAR</button>
              <button>VER</button>
            </div>
          </div>
    `,
    )
    .join("");
}

let categories = [];
async function loadCategories() {
  const selectEl = document.getElementById("data-select");
  if (!selectEl) return;

  const { data, error } = await indexSupabase
    .from("categories")
    .select("id, name");

  if (error) return;

  if (data) {
    categories = data;
    selectEl.innerHTML =
      '<option value="" disabled selected hidden>Please select a category</option>';
    data.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectEl.appendChild(option);
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  bookList();
});
