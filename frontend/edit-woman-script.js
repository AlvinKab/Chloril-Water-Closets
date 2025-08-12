document.addEventListener('DOMContentLoaded', async () => {
    const editWomanForm = document.getElementById('edit-woman-form');
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

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

        const res = await fetch(`http://localhost:7800/api/toilets/${name}`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const userData = await res.json();

            document.getElementById('stall-no').value = userData.womenToiletStallNo;
            if (userData.womenToiletStallStatus.bowlAndCisternStatus === "Critical") {
                document.getElementById('bowl-and-cistern-critical').checked = true;
            } else if (userData.womenToiletStallStatus.bowlAndCisternStatus === "Bad") {
                document.getElementById('bowl-and-cistern-bad').checked = true;
            } else if (userData.womenToiletStallStatus.bowlAndCisternStatus === "Acceptable") {
                document.getElementById('bowl-and-cistern-acceptable').checked = true;
            } else if (userData.womenToiletStallStatus.bowlAndCisternStatus === "Good") {
                document.getElementById('bowl-and-cistern-good').checked = true;
            }
            document.getElementById('bowl-and-cistern-details').value = userData.womenToiletStallStatusDetails[0];
            if (userData.womenToiletStallStatus.bidetStatus === "Critical") {
                document.getElementById('bidet-critical').checked = true;
            } else if (userData.womenToiletStallStatus.bidetStatus === "Bad") {
                document.getElementById('bidet-bad').checked = true;
            } else if (userData.womenToiletStallStatus.bidetStatus === "Acceptable") {
                document.getElementById('bidet-acceptable').checked = true;
            } else if (userData.womenToiletStallStatus.bidetStatus === "Good") {
                document.getElementById('bidet-good').checked = true;
            }
            document.getElementById('bidet-details').value = userData.womenToiletStallStatusDetails[1];
            if (userData.womenToiletStallStatus.toiletPaperStatus === "Critical") {
                document.getElementById('toilet-paper-critical').checked = true;
            } else if (userData.womenToiletStallStatus.toiletPaperStatus === "Bad") {
                document.getElementById('toilet-paper-bad').checked = true;
            } else if (userData.womenToiletStallStatus.toiletPaperStatus === "Acceptable") {
                document.getElementById('toilet-paper-acceptable').checked = true;
            } else if (userData.womenToiletStallStatus.toiletPaperStatus === "Good") {
                document.getElementById('toilet-paper-good').checked = true;
            }
            document.getElementById('toilet-paper-details').value = userData.womenToiletStallStatusDetails[2];

            document.getElementById('sink-no').value = userData.womenToiletSinkNo;
            if (userData.womenToiletSinkStatus.tapAndDrainStatus === "Critical") {
                document.getElementById('tap-and-drain-critical').checked = true;
            } else if (userData.womenToiletSinkStatus.tapAndDrainStatus === "Bad") {
                document.getElementById('tap-and-drain-bad').checked = true;
            } else if (userData.womenToiletSinkStatus.tapAndDrainStatus === "Acceptable") {
                document.getElementById('tap-and-drain-acceptable').checked = true;
            } else if (userData.womenToiletSinkStatus.tapAndDrainStatus === "Good") {
                document.getElementById('tap-and-drain-good').checked = true;
            }
            document.getElementById('tap-and-drain-details').value = userData.womenToiletSinkStatusDetails[0];
            if (userData.womenToiletSinkStatus.soapStatus === "Critical") {
                document.getElementById('soap-critical').checked = true;
            } else if (userData.womenToiletSinkStatus.soapStatus === "Bad") {
                document.getElementById('soap-bad').checked = true;
            } else if (userData.womenToiletSinkStatus.soapStatus === "Acceptable") {
                document.getElementById('soap-acceptable').checked = true;
            } else if (userData.womenToiletSinkStatus.soapStatus === "Good") {
                document.getElementById('soap-good').checked = true;
            }
            document.getElementById('soap-details').value = userData.womenToiletSinkStatusDetails[1];
            if (userData.womenToiletSinkStatus.paperTowelStatus === "Critical") {
                document.getElementById('paper-towel-critical').checked = true;
            } else if (userData.womenToiletSinkStatus.paperTowelStatus === "Bad") {
                document.getElementById('paper-towel-bad').checked = true;
            } else if (userData.womenToiletSinkStatus.paperTowelStatus === "Acceptable") {
                document.getElementById('paper-towel-acceptable').checked = true;
            } else if (userData.womenToiletSinkStatus.paperTowelStatus === "Good") {
                document.getElementById('paper-towel-good').checked = true;
            }
            document.getElementById('paper-towel-details').value = userData.womenToiletSinkStatusDetails[2];
        } else {
            const loadFailurePopup = document.getElementById('loading-failure-popup');
            const closeLoadFailureBtn = document.getElementById('close-loading-failure-popup-btn');
            loadFailurePopup.showModal();
            closeLoadFailureBtn.addEventListener('click', () => {loadFailurePopup.close();});
            return;
        }
    } catch(err) {
        console.error('Error fetching toilet data: ', err);
    }

    editWomanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(editWomanForm);
        
        const womenToiletStallNo = formData.get('stallNumber');
        const bowlAndCisternStatus = formData.get('bowlAndCisternStatus');
        const bidetStatus = formData.get('bidetStatus');
        const toiletPaperStatus = formData.get('toiletPaperStatus');
        const womenToiletStallStatus = { bowlAndCisternStatus, bidetStatus, toiletPaperStatus };
        const bowlAndCisternStatusDetails = formData.get('bowlAndCisternDetails');
        const bidetStatusDetails = formData.get('bidetDetails');
        const toiletPaperStatusDetails = formData.get('toiletPaperDetails');
        const womenToiletStallStatusDetails = [bowlAndCisternStatusDetails, bidetStatusDetails, toiletPaperStatusDetails];

        const womenToiletSinkNo = formData.get('sinkNumber');
        const tapAndDrainStatus = formData.get('tapAndDrainStatus');
        const soapStatus = formData.get('soapStatus');
        const paperTowelStatus = formData.get('paperTowelStatus');
        const womenToiletSinkStatus = { tapAndDrainStatus, soapStatus, paperTowelStatus };
        const tapAndDrainStatusDetails = formData.get('tapAndDrainDetails');
        const soapStatusDetails = formData.get('soapDetails');
        const paperTowelStatusDetails = formData.get('paperTowelDetails');
        const womenToiletSinkStatusDetails = [tapAndDrainStatusDetails, soapStatusDetails, paperTowelStatusDetails];
        try {
            const res = await fetch(`http://localhost:7800/api/toilets/${name}/women`, {
                'method': 'PUT',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ womenToiletStallNo, womenToiletStallStatus, womenToiletStallStatusDetails, womenToiletSinkNo, womenToiletSinkStatus, womenToiletSinkStatusDetails })
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
                successOrFailurePopup.getElementsByTagName('p')[0].textContent = `Toilet details updated successfully.`;
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