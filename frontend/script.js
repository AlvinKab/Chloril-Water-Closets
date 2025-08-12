document.addEventListener('DOMContentLoaded', async () => {
    function checkUserLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    const isLoggedIn = checkUserLoggedIn();

    if (isLoggedIn) {
        window.location.replace('view-branches.html');
    }
});