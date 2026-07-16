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

async function bookList(categoryId = null) {
  // 변수명을 categoryId로 명확하게 변경
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
    $cardContainer.innerHTML = "등록된 책이 없습니다.";
    return;
  }

  const filteredBooks =
    categoryId === null || categoryId === undefined
      ? data
      : data.filter((book) => book.category_id === Number(categoryId));

  if (filteredBooks.length === 0) {
    $cardContainer.innerHTML = "이 카테고리에 등록된 상품이 없습니다.";
    return;
  }

  // 필터링된 데이터를 화면에 그립니다.
  $cardContainer.innerHTML = filteredBooks
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

// 카테고리 클릭 시 필터링 실행
function handleFilter(id) {
  bookList(id);
}
let categories = [];

async function loadCategories() {
  const selectEl = document.getElementById("data-select");
  const categoryContainer = document.getElementById("category"); // 변수명 충돌 방지를 위해 Container로 변경

  // 1. Supabase에서 카테고리 정보 가져오기
  const { data, error } = await indexSupabase
    .from("categories")
    .select("id, name");

  if (error) {
    console.error("카테고리를 로드하는 중 에러 발생:", error);
    return;
  }

  if (data) {
    categories = data;
    // 2. 글 등록/수정 폼의 셀렉트 박스(드롭다운) 그리기 (요소가 있을 때만 실행)
    if (selectEl) {
      selectEl.innerHTML =
        '<option value="" disabled selected hidden>Please select a category</option>';
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        selectEl.appendChild(option);
      });

      selectEl.onchange = function (event) {
        const selectedCategoryId = event.target.value;
        console.log("선택된 카테고리 ID:", selectedCategoryId);

        // 이곳에 선택했을 때 실행하고 싶은 함수를 작성하세요!
        예: handleFilter(selectedCategoryId);
      };
    }
    // 3. 메인 화면의 카테고리 필터 버튼 탭 그리기 (요소가 있을 때만 실행)
    if (categoryContainer) {
      categoryContainer.innerHTML = data
        .map(
          (item) =>
            `<span onclick="handleFilter(${item.id})">${item.name}</span>`,
        )
        .join("");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  bookList();
});
