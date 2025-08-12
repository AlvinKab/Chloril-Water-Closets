document.addEventListener('DOMContentLoaded', async () => {
    const editManForm = document.getElementById('edit-man-form');
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

            document.getElementById('stall-no').value = userData.menToiletStallNo;
            if (userData.menToiletStallStatus.bowlAndCisternStatus === "Critical") {
                document.getElementById('bowl-and-cistern-critical').checked = true;
            } else if (userData.menToiletStallStatus.bowlAndCisternStatus === "Bad") {
                document.getElementById('bowl-and-cistern-bad').checked = true;
            } else if (userData.menToiletStallStatus.bowlAndCisternStatus === "Acceptable") {
                document.getElementById('bowl-and-cistern-acceptable').checked = true;
            } else if (userData.menToiletStallStatus.bowlAndCisternStatus === "Good") {
                document.getElementById('bowl-and-cistern-good').checked = true;
            }
            document.getElementById('bowl-and-cistern-details').value = userData.menToiletStallStatusDetails[0];
            if (userData.menToiletStallStatus.bidetStatus === "Critical") {
                document.getElementById('bidet-critical').checked = true;
            } else if (userData.menToiletStallStatus.bidetStatus === "Bad") {
                document.getElementById('bidet-bad').checked = true;
            } else if (userData.menToiletStallStatus.bidetStatus === "Acceptable") {
                document.getElementById('bidet-acceptable').checked = true;
            } else if (userData.menToiletStallStatus.bidetStatus === "Good") {
                document.getElementById('bidet-good').checked = true;
            }
            document.getElementById('bidet-details').value = userData.menToiletStallStatusDetails[1];
            if (userData.menToiletStallStatus.toiletPaperStatus === "Critical") {
                document.getElementById('toilet-paper-critical').checked = true;
            } else if (userData.menToiletStallStatus.toiletPaperStatus === "Bad") {
                document.getElementById('toilet-paper-bad').checked = true;
            } else if (userData.menToiletStallStatus.toiletPaperStatus === "Acceptable") {
                document.getElementById('toilet-paper-acceptable').checked = true;
            } else if (userData.menToiletStallStatus.toiletPaperStatus === "Good") {
                document.getElementById('toilet-paper-good').checked = true;
            }
            document.getElementById('toilet-paper-details').value = userData.menToiletStallStatusDetails[2];
            
            document.getElementById('urinal-no').value = userData.menToiletUrinalNo;
            if (userData.menToiletUrinalStatus.urinalStatus === "Critical") {
                document.getElementById('urinal-critical').checked = true;
            } else if (userData.menToiletUrinalStatus.urinalStatus === "Bad") {
                document.getElementById('urinal-bad').checked = true;
            } else if (userData.menToiletUrinalStatus.urinalStatus === "Acceptable") {
                document.getElementById('urinal-acceptable').checked = true;
            } else if (userData.menToiletUrinalStatus.urinalStatus === "Good") {
                document.getElementById('urinal-good').checked = true;
            }
            document.getElementById('urinal-details').value = userData.menToiletUrinalStatusDetails[0];

            document.getElementById('sink-no').value = userData.menToiletSinkNo;
            if (userData.menToiletSinkStatus.tapAndDrainStatus === "Critical") {
                document.getElementById('tap-and-drain-critical').checked = true;
            } else if (userData.menToiletSinkStatus.tapAndDrainStatus === "Bad") {
                document.getElementById('tap-and-drain-bad').checked = true;
            } else if (userData.menToiletSinkStatus.tapAndDrainStatus === "Acceptable") {
                document.getElementById('tap-and-drain-acceptable').checked = true;
            } else if (userData.menToiletSinkStatus.tapAndDrainStatus === "Good") {
                document.getElementById('tap-and-drain-good').checked = true;
            }
            document.getElementById('tap-and-drain-details').value = userData.menToiletSinkStatusDetails[0];
            if (userData.menToiletSinkStatus.soapStatus === "Critical") {
                document.getElementById('soap-critical').checked = true;
            } else if (userData.menToiletSinkStatus.soapStatus === "Bad") {
                document.getElementById('soap-bad').checked = true;
            } else if (userData.menToiletSinkStatus.soapStatus === "Acceptable") {
                document.getElementById('soap-acceptable').checked = true;
            } else if (userData.menToiletSinkStatus.soapStatus === "Good") {
                document.getElementById('soap-good').checked = true;
            }
            document.getElementById('soap-details').value = userData.menToiletSinkStatusDetails[1];
            if (userData.menToiletSinkStatus.paperTowelStatus === "Critical") {
                document.getElementById('paper-towel-critical').checked = true;
            } else if (userData.menToiletSinkStatus.paperTowelStatus === "Bad") {
                document.getElementById('paper-towel-bad').checked = true;
            } else if (userData.menToiletSinkStatus.paperTowelStatus === "Acceptable") {
                document.getElementById('paper-towel-acceptable').checked = true;
            } else if (userData.menToiletSinkStatus.paperTowelStatus === "Good") {
                document.getElementById('paper-towel-good').checked = true;
            }
            document.getElementById('paper-towel-details').value = userData.menToiletSinkStatusDetails[2];
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

    editManForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(editManForm);
        
        const menToiletStallNo = formData.get('stallNumber');
        const bowlAndCisternStatus = formData.get('bowlAndCisternStatus');
        const bidetStatus = formData.get('bidetStatus');
        const toiletPaperStatus = formData.get('toiletPaperStatus');
        const menToiletStallStatus = { bowlAndCisternStatus, bidetStatus, toiletPaperStatus };
        const bowlAndCisternStatusDetails = formData.get('bowlAndCisternDetails');
        const bidetStatusDetails = formData.get('bidetDetails');
        const toiletPaperStatusDetails = formData.get('toiletPaperDetails');
        const menToiletStallStatusDetails = [bowlAndCisternStatusDetails, bidetStatusDetails, toiletPaperStatusDetails];

        const menToiletUrinalNo = formData.get('urinalNumber');
        const urinalStatus = formData.get('urinalStatus');
        const menToiletUrinalStatus = { urinalStatus };
        const urinalStatusDetails = formData.get('urinalDetails');
        const menToiletUrinalStatusDetails = [urinalStatusDetails];

        const menToiletSinkNo = formData.get('sinkNumber');
        const tapAndDrainStatus = formData.get('tapAndDrainStatus');
        const soapStatus = formData.get('soapStatus');
        const paperTowelStatus = formData.get('paperTowelStatus');
        const menToiletSinkStatus = { tapAndDrainStatus, soapStatus, paperTowelStatus };
        const tapAndDrainStatusDetails = formData.get('tapAndDrainDetails');
        const soapStatusDetails = formData.get('soapDetails');
        const paperTowelStatusDetails = formData.get('paperTowelDetails');
        const menToiletSinkStatusDetails = [tapAndDrainStatusDetails, soapStatusDetails, paperTowelStatusDetails];
        try {
            const res = await fetch(`http://localhost:7800/api/toilets/${name}/men`, {
                'method': 'PUT',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/JSON'
                },
                'body': JSON.stringify({ menToiletStallNo, menToiletStallStatus, menToiletStallStatusDetails, menToiletUrinalNo, menToiletUrinalStatus, menToiletUrinalStatusDetails, menToiletSinkNo, menToiletSinkStatus, menToiletSinkStatusDetails })
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