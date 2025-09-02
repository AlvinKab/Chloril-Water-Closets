document.addEventListener('DOMContentLoaded', async () => {
    const addBranchForm = document.getElementById('add-branch-form');
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
    
    addBranchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(addBranchForm);
        const branchName = formData.get('branch-name');
        const menToiletStallNo = formData.get('men-stalls');
        const menToiletUrinalNo = formData.get('men-urinals');
        const menToiletSinkNo = formData.get('men-sinks');
        const womenToiletStallNo = formData.get('women-stalls');
        const womenToiletSinkNo = formData.get('women-sinks');

        try {
            const res = await fetch('http://localhost:7800/api/branches/', {
                'method': 'POST',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ branchName, menToiletStallNo, menToiletUrinalNo, menToiletSinkNo, womenToiletStallNo, womenToiletSinkNo })
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
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = `Branch added successfully.`;
                successOrFailurePopup.showModal();
                closeSuccessOrFailureBtn.addEventListener('click', () => {successOrFailurePopup.close();});
                successOrFailurePopup.addEventListener('close', () => {window.location.assign('view-branches.html');});
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