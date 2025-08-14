document.addEventListener("DOMContentLoaded", async () => {
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

        const reportContent = document.getElementById('report-content');

        const resBranches = await fetch('http://localhost:7800/api/branches/', {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });

        if (resBranches.ok) {
            const branches = await resBranches.json();

            branches.forEach(async (branch) => {
                const resToilet = await fetch(`http://localhost:7800/api/toilets/${branch.branchName}`, {
                    'method': 'GET',
                    'headers': {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (resToilet.ok) {
                    const toilet = await resToilet.json();

                    const branchSection = document.createElement('section');
                    const sectionHeader = document.createElement('h2');
                    const sectionFinances = document.createElement('div');
                    const revenueField = document.createElement('p');
                    const budgetField = document.createElement('p');
                    const sectionGenders = document.createElement('div');
                    const sectionMen = document.createElement('div');
                    const sectionWomen = document.createElement('div');
                    const menHeader = document.createElement('h3');
                    const womenHeader = document.createElement('h3');
                    const menStallHeader = document.createElement('h4');
                    const womenStallHeader = document.createElement('h4');
                    const menUrinalHeader = document.createElement('h4');
                    const menSinkHeader = document.createElement('h4');
                    const womenSinkHeader = document.createElement('h4');
                    const menStallNoField = document.createElement('p');
                    const womenStallNoField = document.createElement('p');
                    const menStallUL = document.createElement('ul');
                    const womenStallUL = document.createElement('ul');
                    const menBowlAndCisternLI = document.createElement('li');
                    const womenBowlAndCisternLI = document.createElement('li');
                    const menBidetLI = document.createElement('li');
                    const womenBidetLI = document.createElement('li');
                    const menToiletPaperLI = document.createElement('li');
                    const womenToiletPaperLI = document.createElement('li');
                    const menUrinalNoField = document.createElement('p');
                    const menUrinalStatusP = document.createElement('p');
                    const menSinkNoField = document.createElement('p');
                    const womenSinkNoField = document.createElement('p');
                    const menSinkUL = document.createElement('ul');
                    const womenSinkUL = document.createElement('ul');
                    const menTapAndDrainLI = document.createElement('li');
                    const womenTapAndDrainLI = document.createElement('li');
                    const menSoapLI = document.createElement('li');
                    const womenSoapLI = document.createElement('li');
                    const menPaperTowelLI = document.createElement('li');
                    const womenPaperTowelLI = document.createElement('li');

                    function statusMutatorForMajorComponent(status) {
                        if (status === "Good") return "All good";
                        else if (status === "Acceptable") return "Minor repairs needed";
                        else if (status === "Bad") return "Major repairs needed";
                        else if (status === "Critical") return "Replacement needed";
                    }

                    function statusMutatorForMinorComponent(status) {
                        if (status === "Good") return "Full";
                        else if (status === "Acceptable") return "Slightly used";
                        else if (status === "Bad") return "Almost empty";
                        else if (status === "Critical") return "Empty";
                    }

                    sectionHeader.textContent = branch.branchName;
                    menHeader.textContent = "Men";
                    womenHeader.textContent = "Women";
                    menHeader.style = 'text-decoration: underline;';
                    womenHeader.style = 'text-decoration: underline;';
                    menStallHeader.textContent = "Stalls";
                    menStallNoField.textContent = `${branch.branchName} has ${toilet.menToiletStallNo} stall(s) for men.`;
                    menBowlAndCisternLI.textContent = `Bowls and cisterns: ${statusMutatorForMajorComponent(toilet.menToiletStallStatus.bowlAndCisternStatus)}; ${toilet.menToiletStallStatusDetails[0]}`;
                    menBidetLI.textContent = `Bidets: ${statusMutatorForMajorComponent(toilet.menToiletStallStatus.bidetStatus)}; ${toilet.menToiletStallStatusDetails[1]}`;
                    menToiletPaperLI.textContent = `Toilet paper: ${statusMutatorForMinorComponent(toilet.menToiletStallStatus.toiletPaperStatus)}; ${toilet.menToiletStallStatusDetails[2]}`;
                    menStallUL.style = 'list-style-position: inside;';
                    menStallUL.appendChild(menBowlAndCisternLI);
                    menStallUL.appendChild(menBidetLI);
                    menStallUL.appendChild(menToiletPaperLI);
                    menUrinalHeader.textContent = "Urinals";
                    menUrinalNoField.textContent = `${branch.branchName} has ${toilet.menToiletUrinalNo} urinal(s).`;
                    menUrinalStatusP.textContent = `${statusMutatorForMajorComponent(toilet.menToiletUrinalStatus.urinalStatus)}; ${toilet.menToiletUrinalStatusDetails[0]}`;
                    menSinkHeader.textContent = "Sinks";
                    menSinkNoField.textContent = `${branch.branchName} has ${toilet.menToiletSinkNo} sink(s) for men.`;
                    menTapAndDrainLI.textContent = `Taps and drains: ${statusMutatorForMajorComponent(toilet.menToiletSinkStatus.tapAndDrainStatus)}; ${toilet.menToiletSinkStatusDetails[0]}`;
                    menSoapLI.textContent = `Soap: ${statusMutatorForMinorComponent(toilet.menToiletSinkStatus.soapStatus)}; ${toilet.menToiletSinkStatusDetails[1]}`;
                    menPaperTowelLI.textContent = `Paper towels: ${statusMutatorForMinorComponent(toilet.menToiletSinkStatus.paperTowelStatus)}; ${toilet.menToiletSinkStatusDetails[2]}`;
                    menSinkUL.style = 'list-style-position: inside;';
                    menSinkUL.appendChild(menTapAndDrainLI);
                    menSinkUL.appendChild(menSoapLI);
                    menSinkUL.appendChild(menPaperTowelLI);
                    sectionMen.style = 'margin: 5px;padding: 5px;border: 1px solid;display: flex;flex-direction: column;width: 49%;text-align: left;';
                    sectionMen.appendChild(menHeader);
                    sectionMen.appendChild(menStallHeader);
                    sectionMen.appendChild(menStallNoField);
                    sectionMen.appendChild(menStallUL);
                    sectionMen.appendChild(menUrinalHeader);
                    sectionMen.appendChild(menUrinalNoField);
                    sectionMen.appendChild(menUrinalStatusP);
                    sectionMen.appendChild(menSinkHeader);
                    sectionMen.appendChild(menSinkNoField);
                    sectionMen.appendChild(menSinkUL);
                    womenStallHeader.textContent = "Stalls";
                    womenStallNoField.textContent = `${branch.branchName} has ${toilet.womenToiletStallNo} stall(s) for women.`;
                    womenBowlAndCisternLI.textContent = `Bowls and cisterns: ${statusMutatorForMajorComponent(toilet.womenToiletStallStatus.bowlAndCisternStatus)}; ${toilet.womenToiletStallStatusDetails[0]}`;
                    womenBidetLI.textContent = `Bidets: ${statusMutatorForMajorComponent(toilet.womenToiletStallStatus.bidetStatus)}; ${toilet.womenToiletStallStatusDetails[1]}`;
                    womenToiletPaperLI.textContent = `Toilet paper: ${statusMutatorForMinorComponent(toilet.womenToiletStallStatus.toiletPaperStatus)}; ${toilet.womenToiletStallStatusDetails[2]}`;
                    womenStallUL.style = 'list-style-position: inside;';
                    womenStallUL.appendChild(womenBowlAndCisternLI);
                    womenStallUL.appendChild(womenBidetLI);
                    womenStallUL.appendChild(womenToiletPaperLI);
                    womenSinkHeader.textContent = "Sinks";
                    womenSinkNoField.textContent = `${branch.branchName} has ${toilet.womenToiletSinkNo} sink(s) for women.`;
                    womenTapAndDrainLI.textContent = `Taps and drains: ${statusMutatorForMajorComponent(toilet.womenToiletSinkStatus.tapAndDrainStatus)}; ${toilet.womenToiletSinkStatusDetails[0]}`;
                    womenSoapLI.textContent = `Soap: ${statusMutatorForMinorComponent(toilet.womenToiletSinkStatus.soapStatus)}; ${toilet.womenToiletSinkStatusDetails[1]}`;
                    womenPaperTowelLI.textContent = `Paper towels: ${statusMutatorForMinorComponent(toilet.womenToiletSinkStatus.paperTowelStatus)}; ${toilet.womenToiletSinkStatusDetails[2]}`;
                    womenSinkUL.style = 'list-style-position: inside;';
                    womenSinkUL.appendChild(womenTapAndDrainLI);
                    womenSinkUL.appendChild(womenSoapLI);
                    womenSinkUL.appendChild(womenPaperTowelLI);
                    sectionWomen.style = 'margin: 5px;padding: 5px;border: 1px solid;display: flex;flex-direction: column;width: 49%;text-align: left;';
                    sectionWomen.appendChild(womenHeader);
                    sectionWomen.appendChild(womenStallHeader);
                    sectionWomen.appendChild(womenStallNoField);
                    sectionWomen.appendChild(womenStallUL);
                    sectionWomen.appendChild(womenSinkHeader);
                    sectionWomen.appendChild(womenSinkNoField);
                    sectionWomen.appendChild(womenSinkUL);
                    sectionGenders.style = 'display: flex;width: 100%';
                    sectionGenders.appendChild(sectionMen);
                    sectionGenders.appendChild(sectionWomen);
                    revenueField.textContent = `Revenue generated in previous month: ${branch.branchRevenue}`;
                    budgetField.textContent = `Budget allocated for next month: ${branch.branchBudget}`;
                    sectionFinances.appendChild(revenueField);
                    sectionFinances.appendChild(budgetField);
                    branchSection.appendChild(sectionHeader);
                    branchSection.appendChild(sectionFinances);
                    branchSection.appendChild(sectionGenders);

                    reportContent.appendChild(branchSection);
                } else {
                    const loadFailurePopup = document.getElementById('loading-failure-popup');
                    const closeLoadFailureBtn = document.getElementById('close-loading-failure-popup-btn');
                    loadFailurePopup.showModal();
                    closeLoadFailureBtn.addEventListener('click', () => {loadFailurePopup.close();});
                    return;
                }
            });
        } else {
            const loadFailurePopup = document.getElementById('loading-failure-popup');
            const closeLoadFailureBtn = document.getElementById('close-loading-failure-popup-btn');
            loadFailurePopup.showModal();
            closeLoadFailureBtn.addEventListener('click', () => {loadFailurePopup.close();});
            return;
        }
    } catch(err) {
        console.log("Error: ", err);
    }
});