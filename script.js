const subCategories = {
  "Образование": ["Училища", "Университети", "Детски градини"],
  "Здравеопазване": ["Болници", "Лични лекари", "Аптеки"],
  "Инфраструктура": ["Пътища", "Паркове", "Транспорт"]
};

document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', () => {
    const selected = cat.dataset.category;
    const container = document.getElementById("subCategoryContainer");
    container.innerHTML = subCategories[selected].map(sub => `<div>➡️ ${sub}</div>`).join('');
  });
});

function postComment() {
  const box = document.getElementById("commentBox");
  const text = box.value.trim();
  if (!text) return alert("Моля, въведете мнение.");
  const list = document.getElementById("commentList");
  const item = document.createElement("div");
  item.innerHTML = `💬 ${text}`;
  list.appendChild(item);
  box.value = "";
}

// Автоматичен превод чрез Google Translate (iframe)
document.getElementById("languageSelector").addEventListener("change", function () {
  const lang = this.value;
  const url = `https://translate.google.com/translate?hl=${lang}&sl=auto&u=${window.location.href}`;
  window.open(url, "_blank");
});
