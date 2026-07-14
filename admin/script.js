// ⚠️ 내 프로젝트 정보를 정확히 채워주세요!
const MY_URL = "https://zwyuatfvkchspjtskcff.supabase.co";
const MY_KEY = "sb_publishable_Z76E40NfSGLSU1LWNlKzFQ_kvezPIsW";

const adminSupabase = window.supabase.createClient(MY_URL, MY_KEY);

// Delete book function
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

// Upload/Register Book Action
document.getElementById("upload-btn").addEventListener("click", async () => {
  const categoryId = document.getElementById("data-select").value;
  const title = document.getElementById("book-title").value;
  const price = document.getElementById("book-price").value;
  const description = document.getElementById("book-desc").value;
  const imageFile = document.getElementById("book-image").files[0];

  if (!categoryId || !title || !price || !description || !imageFile) {
    alert("Please fill in all fields and select a cover image!");
    return;
  }

  try {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await adminSupabase.storage
      .from("book-covers")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert("Image upload failed: " + uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = adminSupabase.storage.from("book-covers").getPublicUrl(fileName);

    const { error: insertError } = await adminSupabase.from("books").insert([
      {
        title,
        price: parseFloat(price),
        description,
        image_url: publicUrl,
        category_id: parseInt(categoryId),
        amount: 0,
      },
    ]);

    if (insertError) {
      alert("Database saving failed: " + insertError.message);
    } else {
      alert("🎉 Book successfully registered!");
      document.getElementById("data-select").value = "";
      document.getElementById("book-title").value = "";
      document.getElementById("book-price").value = "";
      document.getElementById("book-desc").value = "";
      document.getElementById("book-image").value = "";
      document.getElementById("file-name-preview").textContent =
        "No file selected";
      loadAdminBooks();
    }
  } catch (err) {
    alert("Error occurred: " + err.message);
  }
});

// Load Books in Admin View
async function loadAdminBooks() {
  const { data, error } = await adminSupabase
    .from("books")
    .select("*")
    .order("id", { ascending: false });

  if (error) return;

  const listContainer = document.getElementById("admin-item-list");
  if (!listContainer) return;

  if (data.length === 0) {
    listContainer.innerHTML =
      "<p style='color:#a3917e; font-size:14px; text-align:center;'>No books registered yet.</p>";
    return;
  }

  listContainer.innerHTML = data
    .map(
      (book) => `
        <div class="item-row">
            <div class="item-info">
                <img class="item-thumb" src="${book.image_url}" onerror="this.src='https://via.placeholder.com/40x50?text=No'">
                <span><strong>${book.title}</strong><span class="item-price">$${book.price || 0}</span></span>
            </div>
            <button class="delete-btn" onclick="deleteBook(${book.id}, '${book.image_url}')">Delete</button>
        </div>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  checkUser();
});
