function logout() {
    localStorage.removeItem('token');
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const adminRole = localStorage.getItem('role') === "Admin";

        if (!adminRole) {
            document.getElementById('link-to-users').style = 'display: none;';
        }

        if (!token) {
            const loginPopup = document.getElementById('login-warning-popup');
            const closeLoginBtn = document.getElementById('close-login-popup-btn');
            loginPopup.showModal();
            closeLoginBtn.addEventListener('click', () => {loginPopup.close();});
            loginPopup.addEventListener('close', () => {window.location.replace('home.html');});
            return;
        }

        if (window.matchMedia("(max-aspect-ratio: 1/1)").matches) {
            const ratioPopup = document.getElementById('ratio-warning-popup');
            const closeRatioBtn = document.getElementById('close-ratio-popup-btn');
            ratioPopup.showModal();
            closeRatioBtn.addEventListener('click', () => {ratioPopup.close();});
        }

        const res = await fetch('http://localhost:7800/api/branches/', {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const branches = await res.json();
            const tbody = document.getElementById('branches-tbody');
            tbody.innerHTML = '';

            branches.forEach(branch => {
                const tr = document.createElement('tr');

                const tdName = document.createElement('td');
                tdName.textContent = branch.branchName;
                tr.appendChild(tdName);

                const genderTd = document.createElement('td');

                const btnMen = document.createElement('button');
                btnMen.className = 'men-btn';
                btnMen.dataset.name = branch.branchName;
                btnMen.textContent = 'Men';
                genderTd.appendChild(btnMen);

                const btnWomen = document.createElement('button');
                btnWomen.className = 'women-btn';
                btnWomen.dataset.name = branch.branchName;
                btnWomen.textContent = 'Women';
                genderTd.appendChild(btnWomen);

                tr.appendChild(genderTd);

                const revenueTd = document.createElement('td');
                const revenueInput = document.createElement('input');
                revenueInput.className = 'revenue-field';
                revenueInput.dataset.id = branch._id;
                revenueInput.value = branch.branchRevenue;
                revenueTd.appendChild(revenueInput);
                tr.appendChild(revenueTd);

                const budgetTd = document.createElement('td');
                const budgetInput = document.createElement('input');
                budgetInput.className = 'budget-field';
                budgetInput.dataset.id = branch._id;
                budgetInput.value = branch.branchBudget;
                budgetInput.min = 0;
                budgetTd.appendChild(budgetInput);
                tr.appendChild(budgetTd);

                const deleteTd = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.dataset.id = branch._id;
                deleteBtn.textContent = 'Delete Branch';
                deleteTd.appendChild(deleteBtn);
                tr.appendChild(deleteTd);

                tbody.appendChild(tr);
            });


            document.querySelectorAll('.men-btn').forEach(button => {
                button.addEventListener('click', handleEditMan);
            });

            document.querySelectorAll('.women-btn').forEach(button => {
                button.addEventListener('click', handleEditWoman);
            });

            document.querySelectorAll('.revenue-field').forEach(input => {
                input.addEventListener('blur', handleUpdateRevenue);
            });

            document.querySelectorAll('.budget-field').forEach(input => {
                input.addEventListener('blur', handleUpdateBudget);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDeleteBranch);
            });
        } else {
            const errorPopup = document.getElementById('error-popup');
            const closeErrorBtn = document.getElementById('close-error-popup-btn');
            errorPopup.showModal();
            closeErrorBtn.addEventListener('click', () => {errorPopup.close();});
        }

        function handleEditMan(e) {
            const name = e.target.dataset.name;
            window.location.assign(`edit-man.html?name=${encodeURIComponent(name)}`);
        }
        
        function handleEditWoman(e) {
            const name = e.target.dataset.name;
            window.location.assign(`edit-woman.html?name=${encodeURIComponent(name)}`);
        }
        
        async function handleUpdateRevenue(e) {
            const id = e.target.dataset.id;
            const branchRevenue = e.target.value;

            const res = await fetch(`http://localhost:7800/api/branches/update-revenue/${id}`, {
                'method': 'PUT',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ branchRevenue })
            });

            const successOrFailurePopup = document.getElementById('success-or-failure-popup');
            const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
            const image = document.getElementById('icon');
            if (image) image.remove();
            const img = document.createElement('img');
            img.id = 'icon';

            if (!res.ok) {
                const error = await res.json();
                img.src = 'custom-failure-icon.png';
                img.alt = "Failure";
                successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = error.message;
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
            }
        }

        async function handleUpdateBudget(e) {
            const id = e.target.dataset.id;
            const branchBudget = e.target.value;

            const res = await fetch(`http://localhost:7800/api/branches/update-budget/${id}`, {
                'method': 'PUT',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ branchBudget })
            });

            const successOrFailurePopup = document.getElementById('success-or-failure-popup');
            const closeSuccessOrFailureBtn = document.getElementById('close-success-or-failure-popup-btn');
            const image = document.getElementById('icon');
            if (image) image.remove();
            const img = document.createElement('img');
            img.id = 'icon';

            if (!res.ok) {
                const error = await res.json();
                img.src = 'custom-failure-icon.png';
                img.alt = "Failure";
                successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = error.message;
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
            }
        }

        function handleDeleteBranch(e) {
            const id = e.target.dataset.id;
            const deletePopup = document.getElementById('delete-warning-popup');
            const confirmBtn = document.getElementById('confirm-btn');
            const cancelBtn = document.getElementById('cancel-btn');

            deletePopup.showModal();
            cancelBtn.addEventListener('click', () => {deletePopup.close();});
            confirmBtn.addEventListener('click', async () => {
                await fetch(`http://localhost:7800/api/branches/${id}`, {
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
                        successOrFailurePopup.getElementsByTagName('p')[0].textContent = `Branch deleted successfully.`;
                        successOrFailurePopup.showModal();
                        closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    } else {
                        deletePopup.close();
                        const error = await res.json();
                        img.src = 'custom-failure-icon.png';
                        img.alt = "Failure";
                        successOrFailurePopup.getElementsByClassName('container')[0].prepend(img);
                        successOrFailurePopup.getElementsByTagName('p')[0].textContent = error.message;
                        successOrFailurePopup.showModal();
                        closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                    }
                })
                .catch(err => {
                    console.error('Error deleting branch: ', err);
                });
            });
        }
        
    } catch(err) {
        console.error('Error: ', err);
    }
});