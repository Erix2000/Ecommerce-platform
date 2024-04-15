// 下拉選單
// 點擊時下拉選單出現
document
.querySelector('.custom-select .selected')
.addEventListener('click', function () {
  const options = this.nextElementSibling
  options.style.display =
    options.style.display === 'block' ? 'none' : 'block'
})

// 當點選某一個選項，最上層的字樣換成被點擊的選項字樣
document.querySelectorAll('.custom-option').forEach((option) => {
option.addEventListener('click', function () {
  const value = this.getAttribute('data-value')
  const selected =
    this.closest('.custom-select').querySelector('.selected')
  selected.innerHTML = `${this.textContent}&nbsp;<i class="bi bi-chevron-down"></i>`
  selected.nextElementSibling.style.display = 'none'
  document.getElementById('customSelectValue').value = value
})
})

// 點選選項的其他地方，選項會被關閉
window.addEventListener('click', function (e) {
const select = document.querySelector('.custom-select')
if (!select.contains(e.target)) {
  select.querySelector('.custom-options').style.display = 'none'
}
})


// 價格範圍
const range = document.querySelectorAll(".range-slider span input");
progress = document.querySelector(".range-slider .progress");
let gap = 0.1;
const inputValue = document.querySelectorAll(".numberVal input");

range.forEach((input) => {
input.addEventListener("input", (e) => {
    let minRange = parseInt(range[0].value);
    let maxRange = parseInt(range[1].value);

    if (maxRange - minRange < gap) {
    if (e.target.className === "range-min") {
        range[0].value = maxRange - gap;
    } else {
        range[1].value = minRange + gap;
    }
    } else {
    progress.style.left = (minRange / range[0].max) * 100 + "%";
    progress.style.right = 100 - (maxRange / range[1].max) * 100 + "%";
    inputValue[0].value = minRange;
    inputValue[1].value = maxRange;
    }
});
});