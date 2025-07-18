const popup = document.getElementById("warning-container");
const btn = document.getElementById("close-popup-btn");
const closePopup = () => {popup.style.display = 'none';}

if (popup && btn) {
    btn.addEventListener("click", closePopup);
}