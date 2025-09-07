function changeLanguage() {
    const selectedLang = document.getElementById("languageSelect").value;
    fetch(`lang/${selectedLang}.json`)
        .then(response => response.json())
        .then(translations => {
            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (translations[key]) {
                    el.textContent = translations[key];
                }
            });
            document.documentElement.lang = selectedLang;
        });
}
