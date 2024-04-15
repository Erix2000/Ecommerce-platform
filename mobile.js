const listIcon = document.querySelector(".list-icon");
const nav = document.querySelector(".nav-m");
const body = document.querySelector("body");
const closeBtn = document.querySelector(".close-btn");

console.log(listIcon,nav,body,closeBtn)

// offcanvas 開合設定---開始
listIcon.addEventListener("click", async (e) => {
    nav.classList.add("nav-active");
    e.stopPropagation();
})
body.addEventListener("click", () => {
    nav.classList.remove("nav-active");
})
nav.addEventListener("click", (e) => {
    e.stopPropagation();
})
closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.remove("nav-active");
})
// offcanvas 開合設定---結束
