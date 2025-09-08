
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const commentText = document.getElementById('commentText');
    const submitBtn = document.getElementById('submitBtn');

    // Зареждане на вече записани мнения (ако ще се показват)
    function loadDiscussions() {
        const discussions = JSON.parse(localStorage.getItem('discussions')) || [];
        const selectedCategory = categorySelect.value;

        const filtered = discussions.filter(d => d.category === selectedCategory);
        console.log("Мнения за категорията", selectedCategory, filtered);

        // Ако искаш да ги показваш в HTML – добави контейнер с ID напр. `discussionList`
        // и тук ги визуализирай
    }

    // Когато потребителят натисне бутона за изпращане
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // За да не презарежда страницата

        const category = categorySelect.value;
        const message = commentText.value.trim();

        if (!category || !message) {
            alert("Моля, попълнете всички полета.");
            return;
        }

        const newDiscussion = {
            category,
            message,
            date: new Date().toLocaleDateString()
        };

        const discussions = JSON.parse(localStorage.getItem('discussions')) || [];
        discussions.push(newDiscussion);
        localStorage.setItem('discussions', JSON.stringify(discussions));

        // Изчистване на полетата
        commentText.value = '';
        categorySelect.selectedIndex = 0;

        alert("Вашето мнение беше запазено успешно!");

        // Ако искаш да заредиш мненията:
        // loadDiscussions();
    });

    // (по избор) Автоматично зареждане при избор на категория
    categorySelect.addEventListener('change', () => {
        loadDiscussions();
    });
});
