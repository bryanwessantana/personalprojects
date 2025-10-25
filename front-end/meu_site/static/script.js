// Pega o botão pelo ID
const darkModeBtn = document.getElementById('toggle-dark');

darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    // Troca o texto do botão
    if (document.body.classList.contains('dark')) {
        darkModeBtn.textContent = "Light Mode";
    } else {
        darkModeBtn.textContent = "Dark Mode";
    }
});
