document.addEventListener('DOMContentLoaded', async () => {
    const changePasswordForm = document.getElementById('change-password-form');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
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

        document.getElementById('new-pass').addEventListener('input', (e) => {
            if (document.getElementById('new-pass').checkValidity()) {
                document.getElementById('new-pass-label').textContent = "New Password [[Hover for details]]";
                e.target.style = 'border-color: green;';
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById('new-pass-label').style = 'color: #FFFFFF;';
                } else {
                    document.getElementById('new-pass-label').style = 'color: #000000;';
                }
            } else {
                e.target.style = 'border-color: red;';
                if (e.target.value.length < 8) {
                    document.getElementById('new-pass-label').style = 'color: red;';
                    document.getElementById('new-pass-label').textContent = "Password must have at least 8 characters.";
                }
            }
        });

        document.getElementById('confirm-new-pass').addEventListener('input', (e) => {
            if (document.getElementById('new-pass').value !== e.target.value) {
                e.target.style = 'border-color: red;';
                document.getElementById('confirm-new-pass-label').style = 'color: red;';
                document.getElementById('confirm-new-pass-label').textContent = 'Passwords do not match.';
            } else {
                e.target.style = 'border-color: green;';
                document.getElementById('confirm-new-pass-label').textContent = "Confirm New Password";
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById('confirm-new-pass-label').style = 'color: #FFFFFF;';
                } else {
                    document.getElementById('confirm-new-pass-label').style = 'color: #000000;';
                }
            }
        });

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const formData = new FormData(changePasswordForm);
            const oldPassword = formData.get('old-password');
            const newPassword = formData.get('new-password');
            const confirmNewPassword = formData.get('confirm-new-password');

            try {
                const successOrFailurePopup = document.getElementById('success-or-failure-popup');
                const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
                const image = document.getElementById('icon');
                if (image) image.remove();
                const img = document.createElement('img');
                img.id = 'icon';

                if (newPassword !== confirmNewPassword) {
                    successOrFailurePopup.getElementsByTagName('p')[0].textContent = "Passwords do not match";
                    successOrFailurePopup.showModal();
                    closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    return;
                }

                const res = await fetch(`http://localhost:7800/api/users/admin/change-password/${id}`, {
                    'method': 'PUT',
                    'headers': {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'Application/JSON'
                    },
                    'body': JSON.stringify({ oldPassword, newPassword })
                });
                
                if (res.ok) {
                    img.src = 'custom-success-icon.png';
                    img.alt = "Success";
                    successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                    successOrFailurePopup.getElementsByTagName('p')[0].textContent = `User password changed successfully.`;
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
    } else {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                const loginPopup = document.getElementById('login-warning-popup');
                const closeLoginBtn = document.getElementById('close-login-popup-btn');
                loginPopup.showModal();
                closeLoginBtn.addEventListener('click', () => {loginPopup.close();});
                loginPopup.addEventListener('close', () => {window.location.replace('home.html');});
                return;
            }
        } catch(err) {
            console.error('Error getting token: ', err);
        }

        document.getElementById('new-pass').addEventListener('input', (e) => {
            if (document.getElementById('new-pass').checkValidity()) {
                document.getElementById('new-pass-label').textContent = "New Password [[Hover for details]]";
                e.target.style = 'border-color: green;'
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById('new-pass-label').style = 'color: #FFFFFF;';
                } else {
                    document.getElementById('new-pass-label').style = 'color: #000000;';
                }
            } else {
                e.target.style = 'border-color: red;';
                if (e.target.value.length < 8) {
                    document.getElementById('new-pass-label').style = 'color: red;';
                    document.getElementById('new-pass-label').textContent = "Password must have at least 8 characters.";
                }
            }
        });

        document.getElementById('confirm-new-pass').addEventListener('input', (e) => {
            if (document.getElementById('new-pass').value !== e.target.value) {
                e.target.style = 'border-color: red;';
                document.getElementById('confirm-new-pass-label').style = 'color: red;';
                document.getElementById('confirm-new-pass-label').textContent = 'Passwords do not match.';
            } else {
                e.target.style = 'border-color: green;';
                document.getElementById('confirm-new-pass-label').textContent = "Confirm New Password";
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById('confirm-new-pass-label').style = 'color: #FFFFFF;';
                } else {
                    document.getElementById('confirm-new-pass-label').style = 'color: #000000;';
                }
            }
        });

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const formData = new FormData(changePasswordForm);
            const oldPassword = formData.get('old-password');
            const newPassword = formData.get('new-password');
            const confirmNewPassword = formData.get('confirm-new-password');
            
            try {
                const successOrFailurePopup = document.getElementById('success-or-failure-popup');
                const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
                const image = document.getElementById('icon');
                if (image) image.remove();
                const img = document.createElement('img');
                img.id = 'icon';

                if (newPassword !== confirmNewPassword) {
                    successOrFailurePopup.getElementsByTagName('p')[0].textContent = "Passwords do not match";
                    successOrFailurePopup.showModal();
                    closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    return;
                }

                const res = await fetch(`http://localhost:7800/api/users/change-password`, {
                    'method': 'PUT',
                    'headers': {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'Application/JSON'
                    },
                    'body': JSON.stringify({ oldPassword, newPassword })
                });
                
                if (res.ok) {
                    img.src = 'custom-success-icon.png';
                    img.alt = "Success";
                    successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                    successOrFailurePopup.getElementsByTagName('p')[0].textContent = `Password changed successfully.`;
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
    }
});