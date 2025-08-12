document.addEventListener('DOMContentLoaded', async () => {
    const editUserForm = document.getElementById('edit-user-form');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

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

        const res = await fetch(`http://localhost:7800/api/users/admin/${id}`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const userData = await res.json();
            document.getElementById('user').value = userData.username;
            document.getElementById('email').value = userData.email;
        } else {
            const loadFailurePopup = document.getElementById('loading-failure-popup');
            const closeLoadFailureBtn = document.getElementById('close-loading-failure-popup-btn');
            loadFailurePopup.showModal();
            closeLoadFailureBtn.addEventListener('click', () => {loadFailurePopup.close();});
            return;
        }
    } catch(err) {
        console.error('Error fetching user data: ', err);
    }

    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(editUserForm);
        const username = formData.get('user');
        const email = formData.get('email');
        try {
            const res = await fetch(`http://localhost:7800/api/users/admin/${id}`, {
                'method': 'PUT',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ username, email })
            });
            
            const successOrFailurePopup = document.getElementById('success-or-failure-popup');
            const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
            const image = document.getElementById('icon');
            if (image) image.remove();
            const img = document.createElement('img');
            img.id = 'icon';

            if (res.ok) {
                img.src = 'custom-success-icon.png';
                img.alt = "Success";
                successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = `User details updated successfully.`;
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