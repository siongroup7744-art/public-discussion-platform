document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const openFormBtn = document.getElementById('open-form-btn');
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-opinion');
    const opinionInput = document.getElementById('opinion-input');
    const discussionContainer = document.getElementById('discussion-container');

    let selectedCategory = '';

    function loadDiscussions() {
        discussionContainer.innerHTML = '';
        const allDiscussions = JSON.parse(localStorage.getItem('discussions')) || [];

        const filtered = allDiscussions.filter(d => d.category === selectedCategory);

        filtered.forEach(discussion => {
            const div = document.createElement('div');
            div.className = 'discussion-item';
            div.innerHTML = `<strong>${discussion.category}</strong> (${discussion.date}):<br>${discussion.message}`;
            discussionContainer.appendChild(div);
        });
    }

    categorySelect.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        loadDiscussions();
    });

    openFormBtn.addEventListener('click', () => {
        if (selectedCategory === '') {
            alert('Моля, изберете категория първо.');
            return;
        }
        formContainer.style.display = 'block';
    });

    submitBtn.addEventListener('click', () => {
        const message = opinionInput.value.trim();
        if (message === '') return;

        const newDiscussion = {
            category: selectedCategory,
            message: message,
            date: new Date().toLocaleDateString()
        };

        const allDiscussions = JSON.parse(localStorage.getItem('discussions')) || [];
        allDiscussions.push(newDiscussion);
        localStorage.setItem('discussions', JSON.stringify(allDiscussions));

        opinionInput.value = '';
        formContainer.style.display = 'none';
        loadDiscussions();
    });

    // Ако има избрана категория при зареждане
    if (categorySelect.value !== '') {
        selectedCategory = categorySelect.value;
        loadDiscussions();
    }
});
