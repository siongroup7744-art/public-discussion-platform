// --- Утилитарни функции ---
function createId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// --- i18n (превод) ---
const translations = {
  bg: {
    platformTitle: "Публична платформа за обсъждания",
    categories: "Категории",
    addCategory: "Добави категория",
    addSubcategory: "Добави подкатегория",
    addTopic: "Добави тема",
    addComment: "Добави мнение",
    noCategories: "Все още няма категории. Добави първата!",
    noSubcategories: "Няма подкатегории в тази категория.",
    noTopics: "Няма теми в тази подкатегория.",
    noComments: "Няма мнения по тази тема.",
    enterCategoryName: "Въведи име на категория:",
    enterSubcategoryName: "Въведи име на подкатегория:",
    enterTopicTitle: "Въведи заглавие на тема:",
    enterCommentText: "Въведи мнение:",
    yes: "Да",
    no: "Не",
    footerText: "© 2025 Платформа за обсъждания",
    selectCategoryPrompt: "Моля, изберете категория, за да започнете.",
    selectSubcategoryPrompt: "Моля, изберете подкатегория.",
    selectTopicPrompt: "Моля, изберете тема.",
    voteRecorded: "Гласът е записан!"
  },
  en: {
    platformTitle: "Public Discussion Platform",
    categories: "Categories",
    addCategory: "Add Category",
    addSubcategory: "Add Subcategory",
    addTopic: "Add Topic",
    addComment: "Add Comment",
    noCategories: "No categories yet. Add the first one!",
    noSubcategories: "No subcategories in this category.",
    noTopics: "No topics in this subcategory.",
    noComments: "No comments for this topic.",
    enterCategoryName: "Enter category name:",
    enterSubcategoryName: "Enter subcategory name:",
    enterTopicTitle: "Enter topic title:",
    enterCommentText: "Enter comment:",
    yes: "Yes",
    no: "No",
    footerText: "© 2025 Discussion Platform",
    selectCategoryPrompt: "Please select a category to start.",
    selectSubcategoryPrompt: "Please select a subcategory.",
    selectTopicPrompt: "Please select a topic.",
    voteRecorded: "Vote recorded!"
  }
};

let currentLang = 'bg';
let data = null;
let currentCategoryId = null;
let currentSubcategoryId = null;
let currentTopicId = null;

// --- ЗАРЕЖДАНЕ И ЗАПАЗВАНЕ ---
function loadData() {
  const saved = localStorage.getItem('discussionData');
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch {
      data = [];
    }
  } else {
    data = [];
  }
}

function saveData() {
  localStorage.setItem('discussionData', JSON.stringify(data));
}

// --- ПРЕВОД ---
function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  // Обнови бутоните за език
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    btn.classList.toggle('active', lang === currentLang);
    btn.setAttribute('aria-pressed', lang === currentLang ? 'true' : 'false');
  });
}

// --- РЕНДЕРИРАНЕ НА КАТЕГОРИИ ---
function renderCategories() {
  const ul = document.getElementById('categories-list');
  ul.innerHTML = '';

  if (data.length === 0) {
    const li = document.createElement('li');
    li.textContent = translations[currentLang].noCategories;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    ul.appendChild(li);
    return;
  }

  data.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat.name;
    li.classList.toggle('active', cat.id === currentCategoryId);
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', cat.id === currentCategoryId ? 'true' : 'false');
    li.addEventListener('click', () => {
      currentCategoryId = cat.id;
      currentSubcategoryId = null;
      currentTopicId = null;
      renderCategories();
      renderSubcategories();
    });
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
    ul.appendChild(li);
  });
}

// --- РЕНДЕРИРАНЕ НА ПОДКАТЕГОРИИ ---
function renderSubcategories() {
  const content = document.getElementById('content-area');
  content.innerHTML = '';

  const category = data.find(c => c.id === currentCategoryId);
  if (!category) {
    content.innerHTML = `<p>${translations[currentLang].selectCategoryPrompt}</p>`;
    return;
  }

  const h3 = document.createElement('h3');
  h3.textContent = category.name;
  content.appendChild(h3);

  const btnAddSubcat = document.createElement('button');
  btnAddSubcat.className = 'btn add-btn';
  btnAddSubcat.textContent = translations[currentLang].addSubcategory;
  btnAddSubcat.addEventListener('click', () => {
    const name = prompt(translations[currentLang].enterSubcategoryName);
    if (name && name.trim()) {
      category.subcategories = category.subcategories || [];
      category.subcategories.push({
        id: createId(),
        name: name.trim(),
        topics: []
      });
      saveData();
      renderSubcategories();
    }
  });
  content.appendChild(btnAddSubcat);

  const list = document.createElement('ul');
  list.className = 'categories-list';
  if (!category.subcategories || category.subcategories.length === 0) {
    const li = document.createElement('li');
    li.textContent = translations[currentLang].noSubcategories;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    list.appendChild(li);
  } else {
    category.subcategories.forEach(sub => {
      const li = document.createElement('li');
      li.textContent = sub.name;
      li.classList.toggle('active', sub.id === currentSubcategoryId);
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-pressed', sub.id === currentSubcategoryId ? 'true' : 'false');
      li.addEventListener('click', () => {
        currentSubcategoryId = sub.id;
        currentTopicId = null;
        renderSubcategories();
        renderTopics();
      });
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          li.click();
        }
      });
      list.appendChild(li);
    });
  }
  content.appendChild(list);
}

// --- РЕНДЕРИРАНЕ НА ТЕМИ ---
function renderTopics() {
  const content = document.getElementById('content-area');
  content.innerHTML = '';

  const category = data.find(c => c.id === currentCategoryId);
  if (!category) {
    content.innerHTML = `<p>${translations[currentLang].selectCategoryPrompt}</p>`;
    return;
  }
  const subcategory = (category.subcategories || []).find(s => s.id === currentSubcategoryId);
  if (!subcategory) {
    content.innerHTML = `<p>${translations[currentLang].selectSubcategoryPrompt}</p>`;
    return;
  }

  const h3 = document.createElement('h3');
  h3.textContent = subcategory.name;
  content.appendChild(h3);

  const btnAddTopic = document.createElement('button');
  btnAddTopic.className = 'btn add-btn';
  btnAddTopic.textContent = translations[currentLang].addTopic;
  btnAddTopic.addEventListener('click', () => {
    const title = prompt(translations[currentLang].enterTopicTitle);
    if (title && title.trim()) {
      subcategory.topics = subcategory.topics || [];
      subcategory.topics.push({
        id: createId(),
        title: title.trim(),
        comments: []
      });
      saveData();
      renderTopics();
    }
  });
  content.appendChild(btnAddTopic);

  const list = document.createElement('ul');
  list.className = 'categories-list';
  if (!subcategory.topics || subcategory.topics.length === 0) {
    const li = document.createElement('li');
    li.textContent = translations[currentLang].noTopics;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    list.appendChild(li);
  } else {
    subcategory.topics.forEach(topic => {
      const li = document.createElement('li');
      li.textContent = topic.title;
      li.classList.toggle('active', topic.id === currentTopicId
                          document.addEventListener('DOMContentLoaded', () => {
  loadData();
  translatePage();
  renderCategories();
});

