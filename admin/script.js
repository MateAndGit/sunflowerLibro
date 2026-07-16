// ⚠️ 내 프로젝트 정보를 정확히 채워주세요!
const MY_URL = "https://zwyuatfvkchspjtskcff.supabase.co";
const MY_KEY = "sb_publishable_Z76E40NfSGLSU1LWNlKzFQ_kvezPIsW";

// ⚠️ 주의: MY_URL과 MY_KEY는 실제 본인의 키로 변경되어 있어야 합니다.
const adminSupabase = window.supabase.createClient(MY_URL, MY_KEY);

let editingBookId = null;
let currentBooks = [];

// Compressor.js를 사용하기 위한 동기식 헬퍼 함수
function compressImageWithLibrary(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // 압축 화질 (0.6이 용량 대비 결과물이 가장 뛰어납니다)
      maxWidth: 800, // 최대 너비 지정
      success(result) {
        // 결과로 나온 Blob을 File 객체로 변환하여 반환
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

// [Delete] 책 삭제 기능
window.deleteBook = async function (id, imageUrl) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const fileName = imageUrl.split("/").pop();
    await adminSupabase.storage.from("book-covers").remove([fileName]);

    const { error: dbError } = await adminSupabase
      .from("books")
      .delete()
      .eq("id", id);

    if (dbError) {
      alert("Database error: " + dbError.message);
    } else {
      alert("🗑️ Successfully deleted.");
      loadAdminBooks();
    }
  } catch (err) {
    alert("An error occurred during deletion.");
    console.error(err);
  }
};

// [Update] 책 수정 모드로 진입하는 기능 (입력창에 기존 데이터 채우기)
window.editBook = function (id) {
  const book = currentBooks.find((b) => b.id === id);
  if (!book) return;

  editingBookId = book.id;

  document.getElementById("data-select").value = book.category_id;
  document.getElementById("book-title").value = book.title;
  document.getElementById("book-price").value = book.price;
  document.getElementById("book-desc").value = book.description;

  document.getElementById("file-name-preview").textContent =
    "Keep existing image (새 이미지 선택 안 함)";
  document.getElementById("book-image").value = "";

  const uploadBtn = document.getElementById("upload-btn");

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 🌟 추가됨: 목록에서 상품을 클릭했을 때 상세 정보를 토글(접고 펼치기)하는 함수
window.toggleDetails = function (id) {
  const detailsDiv = document.getElementById(`details-${id}`);
  if (!detailsDiv) return;

  if (detailsDiv.style.display === "none" || detailsDiv.style.display === "") {
    detailsDiv.style.display = "block";
  } else {
    detailsDiv.style.display = "none";
  }
};

// Custom file upload listener
document.getElementById("book-image").addEventListener("change", function (e) {
  const fileName = e.target.files[0]
    ? e.target.files[0].name
    : "No file selected";
  document.getElementById("file-name-preview").textContent = fileName;
});

// Authentication Status Check
async function checkUser() {
  const {
    data: { session },
  } = await adminSupabase.auth.getSession();
  if (session) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    loadAdminBooks();
    loadCategories();
  } else {
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("admin-section").classList.add("hidden");
  }
}

// Log In Action
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const { error } = await adminSupabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    checkUser();
  }
});

// Log Out Action
document.getElementById("logout-btn").addEventListener("click", async () => {
  await adminSupabase.auth.signOut();
  checkUser();
});

// Load Categories into Select Dropdown
async function loadCategories() {
  const selectEl = document.getElementById("data-select");
  if (!selectEl) return;

  const { data, error } = await adminSupabase
    .from("categories")
    .select("id, name");

  if (error) return;

  if (data) {
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

// [Create & Update] 등록/수정 통합 처리 (Compressor.js 연동 완료!)
document.getElementById("upload-btn").addEventListener("click", async () => {
  const categoryId = document.getElementById("data-select").value;
  const title = document.getElementById("book-title").value;
  const price = document.getElementById("book-price").value;
  const description = document.getElementById("book-desc").value;
  const imageFile = document.getElementById("book-image").files[0];

  if (!categoryId || !title || !price || !description) {
    alert("Please fill in all text fields!");
    return;
  }

  if (!editingBookId && !imageFile) {
    alert("Please select a cover image for the new book!");
    return;
  }

  try {
    let finalImageUrl = null;

    if (imageFile) {
      // 🌟 [핵심 변경 사항] 업로드 전에 Compressor.js 헬퍼 함수로 이미지를 가로채 압축합니다.
      const compressedFile = await compressImageWithLibrary(imageFile);

      // 압축된 파일 정보로 확장자 및 파일명을 재정의합니다.
      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Supabase Storage에 원본 대신 압축된 파일(compressedFile)을 업로드합니다.
      const { error: uploadError } = await adminSupabase.storage
        .from("book-covers")
        .upload(fileName, compressedFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = adminSupabase.storage.from("book-covers").getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    if (editingBookId) {
      const updateData = {
        title,
        price: parseFloat(price),
        description,
        category_id: parseInt(categoryId),
      };

      if (finalImageUrl) updateData.image_url = finalImageUrl;

      const { error: updateError } = await adminSupabase
        .from("books")
        .update(updateData)
        .eq("id", editingBookId);

      if (updateError) {
        alert("Database update failed: " + updateError.message);
      } else {
        alert("✨ Book successfully updated!");
        resetForm();
      }
    } else {
      const { error: insertError } = await adminSupabase.from("books").insert([
        {
          title,
          price: parseFloat(price),
          description,
          image_url: finalImageUrl,
          category_id: parseInt(categoryId),
          amount: 0,
        },
      ]);

      if (insertError) {
        alert("Database saving failed: " + insertError.insertError);
      } else {
        alert("🎉 Book successfully registered!");
        resetForm();
      }
    }
  } catch (err) {
    alert("Error occurred: " + err.message);
  }
});

function resetForm() {
  document.getElementById("data-select").value = "";
  document.getElementById("book-title").value = "";
  document.getElementById("book-price").value = "";
  document.getElementById("book-desc").value = "";
  document.getElementById("book-image").value = "";
  document.getElementById("file-name-preview").textContent = "No file selected";

  editingBookId = null;
  const uploadBtn = document.getElementById("upload-btn");

  loadAdminBooks();
}

// [Read] Load Books in Admin View (상세 정보 뷰 추가 버전)
async function loadAdminBooks() {
  const { data, error } = await adminSupabase
    .from("books")
    .select("*, categories(name)")
    .order("id", { ascending: false });

  if (error) return;

  const listContainer = document.getElementById("admin-item-list");
  if (!listContainer) return;

  if (data.length === 0) {
    listContainer.innerHTML =
      "<p style='color:#a3917e; font-size:14px; text-align:center;'>No books registered yet.</p>";
    return;
  }

  currentBooks = data;

  listContainer.innerHTML = data
    .map(
      (book) => `
        <div class="item-card" style="background:#f9f9f9; border:1px solid #ddd; margin-bottom:10px; border-radius:6px; overflow:hidden;">
            <div class="item-row" onclick="toggleDetails(${book.id})" style="display:flex; align-items:center; justify-content:space-between; padding:12px; cursor:pointer; background:#fff;">
                <div class="item-info" style="display:flex; align-items:center; gap:12px;">
                    <img class="item-thumb" src="${book.image_url}" onerror="this.src='https://via.placeholder.com/40x50?text=No'" style="width:40px; height:50px; object-fit:cover; border-radius:4px;">
                    <div style="display:flex; flex-direction:column; text-align:left;">
                        <span style="font-weight:bold; color:#333;">${book.title}</span>
                        <span class="item-price" style="color:#e44d26; font-size:13px; font-weight:600; margin-top:2px;">$${book.price || 0}</span>
                    </div>
                </div>
                <div class="item-btn" onclick="event.stopPropagation();">
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button onclick="deleteBook(${book.id}, '${book.image_url}')">Delete</button>
                </div>
            </div>
            
            <!-- 🌟 추가됨: 접혀있는 상세설명 영역 (클릭하면 보임) -->
            <div id="details-${book.id}" class="item-details" style="display:none; padding:15px; border-top:1px solid #eee; background:#fafafa; text-align:left; font-size:14px; color:#555;">
                <div style="margin-bottom:8px;"><strong style="color:#2196F3;">Category:</strong> ${book.categories ? book.categories.name : "Uncategorized"}</div>
                <div style="white-space:pre-line; line-height:1.5;"><strong style="color:#333;">Description:</strong><br>${book.description}</div>
            </div>
        </div>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  checkUser();
});
