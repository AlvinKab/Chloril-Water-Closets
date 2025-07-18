const popup = document.getElementById("warning-popup");
const btn = document.getElementById("close-popup-btn");
const closePopup = () => {popup.style.display = 'none';}
btn.addEventListener("click", closePopup);