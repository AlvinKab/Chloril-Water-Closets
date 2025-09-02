function logout() {
    localStorage.removeItem('token');
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', async () => {
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

        const res = await fetch('http://localhost:7800/api/users/admin/', {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const users = await res.json();
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = '';

            users.forEach(user => {
                const tr = document.createElement('tr');

                const tdName = document.createElement('td');
                tdName.textContent = user.username;
                tr.appendChild(tdName);

                const tdEmail = document.createElement('td');
                tdEmail.textContent = user.email;
                tr.appendChild(tdEmail);

                const tdRole = document.createElement('td');
                tdRole.textContent = user.role;
                tr.appendChild(tdRole);
                
                const tdBtns = document.createElement('td');

                const btnEdit = document.createElement('button');
                btnEdit.className = 'edit-btn';
                btnEdit.dataset.id = user._id;
                btnEdit.textContent = "Edit User";
                tdBtns.appendChild(btnEdit);

                const btnChangePass = document.createElement('button');
                btnChangePass.className = 'change-pass-btn';
                btnChangePass.dataset.id = user._id;
                btnChangePass.textContent = "Change User Password";
                tdBtns.appendChild(btnChangePass);

                const btnDelete = document.createElement('button');
                btnDelete.className = 'delete-btn';
                btnDelete.dataset.id = user._id;
                btnDelete.textContent = "Delete User";
                tdBtns.appendChild(btnDelete);

                tr.appendChild(tdBtns);
                
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', handleEditUser);
            });

            document.querySelectorAll('.change-pass-btn').forEach(button => {
                button.addEventListener('click', handleChangePass);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDeleteUser);
            });
        } else {
            const errorPopup = document.getElementById('error-popup');
            const closeErrorBtn = document.getElementById('close-error-popup-btn');
            errorPopup.showModal();
            closeErrorBtn.addEventListener('click', () => {errorPopup.close();});
        }

        function handleEditUser(e) {
            const id = e.target.dataset.id;
            window.location.assign(`edit-user.html?id=${id}`);
        }
        
        function handleChangePass(e) {
            const id = e.target.dataset.id;
            window.location.assign(`change-password.html?id=${id}`);
        }

        function handleDeleteUser(e) {
            const id = e.target.dataset.id;
            const deletePopup = document.getElementById('delete-warning-popup');
            const confirmBtn = document.getElementById('confirm-btn');
            const cancelBtn = document.getElementById('cancel-btn');

            deletePopup.showModal();
            cancelBtn.addEventListener('click', () => {deletePopup.close();});
            confirmBtn.addEventListener('click', async () => {
                await fetch(`http://localhost:7800/api/users/admin/${id}`, {
                    'method': 'DELETE',
                    'headers': {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(async res => {
                    const successOrFailurePopup = document.getElementById('success-or-failure-popup');
                    const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
                    const image = document.getElementById('icon');
                    if (image) image.remove();
                    const img = document.createElement('img');
                    img.id = 'icon';
                    if (res.ok) {
                        deletePopup.close();
                        e.target.closest('tr').remove();
                        img.src = 'custom-success-icon.png';
                        img.alt = "Success";
                        successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                        successOrFailurePopup.getElementsByTagName('p')[0].textContent = `User deleted successfully.`;
                        successOrFailurePopup.showModal();
                        closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    } else {
                        deletePopup.close();
                        error = await res.json();
                        img.src = 'custom-failure-icon.png';
                        img.alt = "Failure";
                        successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                        successOrFailurePopup.getElementsByTagName('p')[0].textContent = error.message;
                        successOrFailurePopup.showModal();
                        closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    }
                })
                .catch(err => {
                    console.error('Error deleting user: ', err);
                });
            });
        }
        
    } catch(err) {
        console.error("Error: ", err);
    }
});