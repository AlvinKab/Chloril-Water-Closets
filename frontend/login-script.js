document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('user');
        const password = formData.get('pass');
        
        try {
            const res = await fetch('http://localhost:7800/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/JSON'
                },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data._id);
                localStorage.setItem('role', data.role)
                window.location.assign('view-branches.html');
            } else {
                const popup = document.getElementById("invalid-warning-popup");
                const btn = document.getElementById("close-popup-btn");
                popup.showModal();
                btn.addEventListener('click', () => {popup.close();});
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});