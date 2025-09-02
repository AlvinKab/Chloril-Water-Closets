document.addEventListener('DOMContentLoaded', async () => {
    const addUserForm = document.getElementById('add-user-form');
    try {
        const token = localStorage.getItem('token');
        const adminRole = localStorage.getItem('role') === "Admin";

        if (!adminRole) {
            const loginPopup = document.getElementById('login-warning-popup');
            const closeLoginBtn = document.getElementById('close-login-popup-btn');
            loginPopup.showModal();
            closeLoginBtn.addEventListener('click', () => {loginPopup.close();});
            if (token) {
                loginPopup.addEventListener('close', () => {window.location.replace('view-branches.html');});
            } else {
                loginPopup.addEventListener('close', () => {window.location.replace('home.html');});
            }
            return;
        }
    } catch(err) {
        console.error('Error getting token: ', err);
    }

    document.getElementById('pass').addEventListener('input', (e) => {
        if (document.getElementById('pass').checkValidity()) {
            document.getElementById('pass-label').textContent = "Password [[Hover for details]]";
            e.target.style = 'border-color: green;';
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById('pass-label').style = 'color: #FFFFFF;';
            } else {
                document.getElementById('pass-label').style = 'color: #000000;';
            }
        } else {
            e.target.style = 'border-color: red;';
            document.getElementById('pass-label').style = 'color: red;';
            if (e.target.value.length < 8) {
                document.getElementById('pass-label').textContent = "Password must have at least 8 characters.";
            } else {
                document.getElementById('pass-label').textContent = "Password contains invalid symbols.";
            }
        }
    });

    document.getElementById('confirm-pass').addEventListener('input', (e) => {
        if (document.getElementById('pass').value !== e.target.value) {
            e.target.style = 'border-color: red;';
            document.getElementById('confirm-pass-label').style = 'color: red;';
            document.getElementById('confirm-pass-label').textContent = 'Passwords do not match.';
        } else {
            e.target.style = 'border-color: green;';
            document.getElementById('confirm-pass-label').textContent = "Confirm Password";
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById('confirm-pass-label').style = 'color: #FFFFFF;';
            } else {
                document.getElementById('confirm-pass-label').style = 'color: #000000;';
            }
        }
    });
    
    addUserForm.addEventListener('submit', async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        const formData = new FormData(addUserForm);
        const username = formData.get('user');
        const email = formData.get('email');
        const role = formData.get('role');
        const password = formData.get('pass');
        const confirmPassword = formData.get('confirm-pass');
        try {
            const successOrFailurePopup = document.getElementById('success-or-failure-popup');
            const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
            const image = document.getElementById('icon');
            if (image) image.remove();
            const img = document.createElement('img');
            img.id = 'icon';

            if (password !== confirmPassword) {
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = "Passwords do not match";
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                return;
            }

            const res = await fetch('http://localhost:7800/api/users/admin/', {
                'method': 'POST',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ username, email, password, role })
            });

            if (res.ok) {
                img.src = 'custom-success-icon.png';
                img.alt = "Success";
                successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = `User added successfully.`;
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                successOrFailurePopup.addEventListener('close', () => {window.location.assign('view-users.html');});
            } else {
                const error = await res.json();
                img.src = 'custom-failure-icon.png';
                img.alt = "Failure";
                successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = error.message;
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
            }
        } catch(err) {
            console.error('Error: ', err);
        }
    });
});