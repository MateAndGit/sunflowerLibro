/* ==========================================================================
   1. 마우스 위치 및 눈동자(Eye) 애니메이션 효과
   ========================================================================== */
const $pointer = document.getElementById("cursor__pointer");
const $innerEyes = document.getElementsByClassName("inner__eye"); // 스네이크 케이스(__)를 카멜케이스로 변경하여 일관성 유지

// 초기 시작 좌표를 화면의 정중앙 좌표로 설정
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

let eyeX = 0;
let eyeY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // 마우스 위치로 부드럽게 커서 이동
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  if ($pointer) $pointer.style.translate = `${cursorX}px ${cursorY}px`;

  // 눈동자가 바라볼 목표 좌표 계산
  const targetEyeX = mouseX - window.innerWidth / 2;
  const targetEyeY = mouseY - window.innerHeight / 2;

  eyeX += (targetEyeX - eyeX) * 0.1;
  eyeY += (targetEyeY - eyeY) * 0.1;

  // 눈동자가 눈 흰자 밖으로 나가지 않도록 한계값 제한
  const limitedX = Math.max(-15, Math.min(15, eyeX * 0.05));
  const limitedY = Math.max(-15, Math.min(15, eyeY * 0.05));

  for (const $eye of $innerEyes) {
    $eye.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

/* ==========================================================================
   2. 장바구니(Cart) 상태 관리 및 기능
   ========================================================================== */
const $countNum = document.getElementById("count__num");
let cartList = [];

// 장바구니 뱃지 숫자 업데이트
function updateCartCount() {
  // cartCountUpdated에서 명동형 동사구로 변경
  $countNum.textContent = cartList.length;
}

// 장바구니 상품 추가
function addToCart(id) {
  const product = products.find((p) => p.id === id);

  if (!product) return;

  const isDuplicated = cartList.find((p) => p.id === id);

  if (isDuplicated) {
    // 수량 변경 시 디버깅 편의를 위해 로그 유지
    console.log("변경 전 수량:", isDuplicated.amount);
    isDuplicated.amount++;
    console.log("변경 후 수량:", isDuplicated.amount);
  } else {
    // 새로운 상품 추가 (원본 데이터 훼손 방지를 위해 스프레드 연산자 사용)
    const newCartItem = { ...product, amount: 1 };
    cartList.unshift(newCartItem);
  }

  updateCartCount();
  alert(`"${product.title}" 상품을 장바구니에 담았습니다.`);
}

// 장바구니 상품 수량 감소
function minusBtn(btn, id) {
  const container = btn.closest(".list__container");
  const currentInput = container.querySelector(".quantity-input");
  const currentPrice = container.querySelector(".quantity-price");

  const product = cartList.find((c) => c.id === id);
  if (!product) return;

  let number = Number(currentInput.value);

  if (number > 1) {
    number--;
    currentInput.value = number;
    product.amount = number; // 장바구니 객체 수량 최신화
    currentPrice.textContent = `$${(product.price * number).toLocaleString()}`;
    updateTotalPrice(); // updatePrice에서 명확한 이름으로 변경
  }
}

// 장바구니 상품 수량 증가
function plusBtn(btn, id) {
  const container = btn.closest(".list__container");
  const currentInput = container.querySelector(".quantity-input");
  const currentPrice = container.querySelector(".quantity-price");

  const product = cartList.find((c) => c.id === id);
  if (!product) return;

  let number = Number(currentInput.value);
  if (number >= 10) {
    alert("한 상품당 최대 10개까지 구매 가능합니다.");
    return;
  }

  number++;
  currentInput.value = number;
  product.amount = number; // 장바구니 객체 수량 최신화
  currentPrice.textContent = `$${(product.price * number).toLocaleString()}`;
  updateTotalPrice(); // updatePrice에서 명확한 이름으로 변경
}

// 장바구니 총 금액 계산 및 갱신
const $totalPrice = document.getElementById("total__price");

function updateTotalPrice() {
  // updatePrice -> updateTotalPrice
  let total = 0; // 오타 수정: totalPirce -> total
  cartList.forEach((item) => {
    total += item.price * item.amount;
  });
  $totalPrice.textContent = `Total: $${total.toLocaleString()}`;
}

// 장바구니 내 특정 상품 삭제
function deleteCartItem(id) {
  // listDelete에서 명확한 기능 위주 이름으로 변경
  cartList = cartList.filter((item) => item.id !== id);
  updateTotalPrice();
  renderCartList(); // renderList -> renderCartList
  updateCartCount();
}

/* ==========================================================================
   3. 모달(Modal) 제어 및 장바구니 UI 렌더링
   ========================================================================== */
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

// 장바구니 목록을 모달 내부에 그리기
function renderCartList() {
  // renderList -> renderCartList로 구체화
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
      (item) => `
      <div class="list__container">
        <div class="list__img-area">
          <img src="${item.image_url || item.image}" loading="lazy" alt="${item.title}"/>
        </div>
        <div class="list__title-amount">
          <h1 class="list__title">${item.title}</h1>
          <div class="quantity-picker">
            <button class="btn-minus" onclick="minusBtn(this, ${item.id})">-</button>
            <input class="quantity-input" type="number" value="${item.amount}" min="1" max="99" readonly/>
            <button class="btn-plus" onclick="plusBtn(this, ${item.id})">+</button>
          </div>
        </div>
        <div class="list__delete-price">
          <div class="list__delete-area" onclick="deleteCartItem(${item.id})">
            <img src="images/delete.png" alt="delete"/>
          </div>
          <p class="quantity-price">$${(item.price * item.amount).toLocaleString()}</p>
        </div>
      </div>
    `,
    )
    .join("");

  updateTotalPrice();
}

$cartWrapper.addEventListener("click", () => {
  openModal();
  renderCartList();
});

$modal.addEventListener("click", (e) => {
  if (e.target === $modal || e.target === $modalClose) {
    closeModal();
  }
});

/* ==========================================================================
   4. Supabase 연동 및 상품/카테고리 목록 바인딩
   ========================================================================== */
const $cardContainer = document.getElementById("card__container");

const SUPABASE_URL = "https://zwyuatfvkchspjtskcff.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z76E40NfSGLSU1LWNlKzFQ_kvezPIsW";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); // 변수명 직관화

let products = [];
let categories = [];

// 책 목록 불러오기 및 필터링 적용 (버튼 2개 및 클래스 토글 추가)
async function fetchBookList(categoryId = null) {
  if (!$cardContainer) return;

  const { data, error } = await supabaseClient
    .from("books")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("도서 데이터를 불러오지 못했습니다:", error);
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
    $cardContainer.innerHTML = `
      <div class="container-empty">
        <div class="no-product-message">등록된 상품이 없습니다.</div>
      </div>
    `;
    return;
  }

  $cardContainer.innerHTML = filteredBooks
    .map(
      (book) => `
      <div class="card" id="card-${book.id}">
        <!-- 클릭 시 나타날 설명글 레이어 (닫기 버튼 추가) -->
        <div class="card__overlay">
          <div class="overlay__close" onclick="toggleDescription(${book.id})">✕</div>
          <p class="overlay__description">
            ${book.description || "No hay descripción disponible."}
          </p>
        </div>

        <div class="card__img-area">
          <img 
            src="${book.image_url}" 
            alt="${book.title}" 
            loading="lazy"
            onload="this.classList.add('loaded'); this.parentElement.classList.add('loaded');"
            onerror="this.src='https://via.placeholder.com/200x250?text=No+Image'; this.classList.add('loaded'); this.parentElement.classList.add('loaded');"
          >
        </div>
        <div class="card__title">
          <h1>${book.title}</h1>
        </div>
        <div class="card__price">
          <p>$${book.price.toLocaleString()}</p>
        </div>
        <div class="card__btns">
          <button class="btn-comprar" onclick="addToCart(${book.id})">COMPRAR</button>
          <button class="btn-ver" onclick="toggleDescription(${book.id})">VER</button>
        </div>
      </div>
    `,
    )
    .join("");
}

// ★ 추가: 카드의 설명 레이어를 토글하는 함수
function toggleDescription(bookId) {
  const card = document.getElementById(`card-${bookId}`);
  if (card) {
    card.classList.toggle("show-description");
  }
}

// 카테고리 클릭 필터 핸들러
function handleFilter(id) {
  fetchBookList(id);
}

// 카테고리 불러오기 및 레이아웃 바인딩
async function loadCategories() {
  const $selectEl = document.getElementById("data-select");
  const $categoryContainer = document.getElementById("category");

  const { data, error } = await supabaseClient
    .from("categories")
    .select("id, name");

  if (error) {
    console.error("카테고리를 불러오지 못했습니다:", error);
    return;
  }

  if (data) {
    categories = data;

    // 1. 드롭다운 선택 필터 바인딩 (수정/등록 페이지 등에 존재 시)
    if ($selectEl) {
      $selectEl.innerHTML =
        '<option value="" disabled selected hidden>Please select a category</option>';
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        $selectEl.appendChild(option);
      });

      $selectEl.onchange = function (event) {
        const selectedCategoryId = event.target.value;
        handleFilter(selectedCategoryId);
      };
    }

    // 2. 메인 페이지 상단 카테고리 태그 버튼 목록 바인딩
    if ($categoryContainer) {
      $categoryContainer.innerHTML = data
        .map(
          (item) =>
            `<span onclick="handleFilter(${item.id})">${item.name}</span>`,
        )
        .join("");
    }
  }
}

// 페이지 초기 로드
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  fetchBookList();
});
