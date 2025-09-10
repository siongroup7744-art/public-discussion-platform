// Данни за категории и подкатегории
const categoriesData = {
  "Образование": ["Училища", "Университети", "Детски градини"],
  "Здравеопазване": ["Болници", "Лични лекари", "Аптеки"],
  "Инфраструктура": ["Пътища", "Паркове", "Транспорт"]
};

// Инициализиране на i18next за преводите
i18next
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'bg',
    debug: false,
    resources: {
      bg: {
        translation: {
          title: "Платформа за обществено обсъждане",
          headerTitle: "Платформа за обществено обсъждане",
          categories: "Категории",
          subcategories: "Подкатегории",
          comments: "Остави мнение",
          back: "Назад",
          postCommentBtn: "Изпрати",
          footer: "Платформа за обществено обсъждане",
          commentPlaceholder: "Вашето мнение...",
          alertEmptyComment: "Моля, въведете мнение.",
          like: "Да",
          dislike: "Не"
        }
      },
      en: {
        translation: {
          title: "Public Discussion Platform",
          headerTitle: "Public Discussion Platform",
          categories: "Categories",
          subcategories: "Subcategories",
          comments: "Leave a Comment",
          back: "Back",
          postCommentBtn: "Post",
          footer: "Public Discussion Platform",
          commentPlaceholder: "Your comment...",
          alertEmptyComment: "Please enter a comment.",
          like: "Yes",
          dislike: "No"
        }
      },
      de: {
        translation: {
          title: "Plattform für öffentliche Diskussionen",
          headerTitle: "Plattform für öffentliche Diskussionen",
          categories: "Kategorien",
          subcategories: "Unterkategorien",
          comments: "Kommentar hinterlassen",
          back: "Zurück",
          postCommentBtn: "Senden",
          footer: "Plattform für öffentliche Diskussionen",
          commentPlaceholder: "Ihr Kommentar...",
          alertEmptyComment: "Bitte geben Sie einen Kommentar ein.",
          like: "Ja",
          dislike: "Nein"
        }
      },
      fr: {
        translation: {
          title: "Plateforme de discussion publique",
          headerTitle: "Plateforme de discussion publique",
          categories: "Catégories",
          subcategories: "Sous-catégories",
          comments: "Laisser un commentaire",
          back: "Retour",
          postCommentBtn: "Envoyer",
          footer: "Plateforme de discussion publique",
          commentPlaceholder: "Votre commentaire...",
          alertEmptyComment: "Veuillez entrer un commentaire.",
          like: "Oui",
          dislike: "Non"
        }
      },
      es: {
        translation: {
          title: "Plataforma de discusión pública",
          headerTitle: "Plataforma de discusión pública",
          categories: "Categorías",
          subcategories: "Subcategorías",
          comments: "Deja un comentario",
          back: "Volver",
          postCommentBtn: "Enviar",
          footer: "Plataforma de discusión pública",
          commentPlaceholder: "Tu comentario...",
          alertEmptyComment: "Por favor ingresa un comentario.",
          like: "Sí",
          dislike: "No"
        }
      }
    }
  }, function(err, t) {
    updateContent();
  });

// Актуализира преводите в DOM
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18next.t(key);
  });
  document.getElementById('commentBox').placeholder = i18next.t('commentPlaceholder');
}

// Слушаме промяна на езика
document.getElementById('languageSelector').addEventListener('change', (e) => {
  i18next.changeLanguage(e.target.value, updateContent);
});

// Декларация на елементи
const categoriesList = document.getElementById('categoriesList');
const subCategorySection = document.querySelector('.subcategories');
const subCategoryContainer = document.getElementById('subCategoryContainer');
const categoriesSection = document.querySelector('.categories');
const commentsSection = document.querySelector('.comments');
const commentBox = document.getElementById('commentBox');
const commentList = document.getElementById('commentList');
const postCommentBtn = document.getElementById('postCommentBtn');
const backToCategoriesBtn = document.getElementById('backToCategories');
const backToSubcategoriesBtn = document.getElementById('backToSubcategories');

let currentCategory = null;
let currentSubcategory = null;

// Зарежда категории
function loadCategories() {
  categoriesList.innerHTML = '';
  Object.keys(categoriesData).forEach(category => {
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = category;
    div.addEventListener('click', () => {
      currentCategory = category;
      showSubcategories(category);
    });
    categoriesList.appendChild(div);
  });
}

// Показва подкатегории
function showSubcategories(category) {
  subCategoryContainer.innerHTML = '';
  const subcategories = categoriesData[category];
  subcategories.forEach(sub => {
    const div = document.createElement('div');
    div.className = 'subcategory';
    div.textContent = sub;
    div.addEventListener('click', () => {
      currentSubcategory = sub;
      showCommentsSection();
    });
    subCategoryContainer.appendChild(div);
  });
  categoriesSection.style.display = 'none';
  subCategorySection.style.display = 'block';
  commentsSection.style.display = 'none';
}

// Показва секцията за коментари
function showCommentsSection() {
  categoriesSection.style.display = 'none';
  subCategorySection.style.display = 'none';
  commentsSection.style.display = 'block';
  loadComments();
}

// Връщане към категории
backToCategoriesBtn.addEventListener('click', () => {
  categoriesSection.style.display = 'block';
  subCategorySection.style.display = 'none';
  commentsSection.style.display = 'none';
});

// Връщане към подкатегории
backToSubcategoriesBtn.addEventListener('click', () => {
  categoriesSection.style.display = 'none';
  subCategorySection.style.display = 'block';
  commentsSection.style.display = 'none';
});

// Локално съхраняване и зареждане на коментари
function loadComments() {
  commentList.innerHTML = '';
  const commentsKey = `${currentCategory}-${currentSubcategory}`;
  const comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
  comments.forEach(({ text, likes = 0, dislikes = 0 }, index) => {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.textContent = text;

    const voteDiv = document.createElement('div');
    voteDiv.className = 'vote-buttons';

    const likeBtn = document.createElement('button');
    likeBtn.textContent = `${i18next.t('like')} (${likes})`;
    likeBtn.addEventListener('click', () => voteComment(index, true));

    const dislikeBtn = document.createElement('button');
    dislikeBtn.textContent = `${i18next.t('dislike')} (${dislikes})`;
    dislikeBtn.addEventListener('click', () => voteComment(index, false));

    voteDiv.appendChild(likeBtn);
    voteDiv.appendChild(dislikeBtn);
    div.appendChild(voteDiv);

    commentList.appendChild(div);
  });
}

// Гласуване за коментар
function voteComment(index, isLike) {
  const key = `${currentCategory}-${currentSubcategory}`;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  if (comments[index]) {
    if (isLike) comments[index].likes = (comments[index].likes || 0) + 1;
    else comments[index].dislikes = (comments[index].dislikes || 0) + 1;
    localStorage.setItem(key, JSON.stringify(comments));
    loadComments();
  }
}

// Добавяне на коментар
postCommentBtn.addEventListener('click', () => {
  const comment = commentBox.value.trim();
  if (!comment) {
    alert(i18next.t('alertEmptyComment'));
    return;
  }

  const key = `${currentCategory}-${currentSubcategory}`;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  comments.push({ text: comment, likes: 0, dislikes: 0 });
  localStorage.setItem(key, JSON.stringify(comments));
  commentBox.value = '';
  loadComments();
});

// Старт
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});
