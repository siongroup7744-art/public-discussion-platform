let translations = {};
let currentLang = 'bg';

const categories = {
  transport: {
    titleKey: "cat_transport",
    sub: [
      { questionKey: "sub_metro" }
    ]
  },
  education: {
    titleKey: "cat_education",
    sub: [
      { questionKey: "sub_digital_books" }
    ]
  }
};

async function loadLanguage(lang) {
  currentLang = lang;
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();

  document.title = translations.title;
  document.getElementById("headerTitle").textContent = translations.title;
  renderCategories();
}

function renderCategories() {
  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  for (const key in categories) {
    const cat = categories[key];
    const catDiv = document.createElement("div");
    catDiv.className = "category";

    const h2 = document.createElement("h2");
    h2.textContent = translations[cat.titleKey];
    catDiv.appendChild(h2);

    cat.sub.forEach((sub, index) => {
      const subDiv = document.createElement("div");
      subDiv.className = "subcategory";

      const p = document.createElement("p");
      p.textContent = translations[sub.questionKey];

      const voteDiv = document.createElement("div");
      voteDiv.className = "vote-buttons";

      const yesBtn = document.createElement("button");
      yesBtn.className = "yes";
      yesBtn.textContent = translations.vote_yes;
      yesBtn.onclick = () => alert(translations.vote_yes_thank);

      const noBtn = document.createElement("button");
      noBtn.className = "no";
      noBtn.textContent = translations.vote_no;
      noBtn.onclick = () => alert(translations.vote_no_thank);

      voteDiv.appendChild(yesBtn);
      voteDiv.appendChild(noBtn);

      const textarea = document.createElement("textarea");
      textarea.placeholder = translations.opinion_placeholder;

      subDiv.appendChild(p);
      subDiv.appendChild(voteDiv);
      subDiv.appendChild(textarea);

      catDiv.appendChild(subDiv);
    });

    container.appendChild(catDiv);
  }
}

function initApp() {
  loadLanguage(currentLang);
}
