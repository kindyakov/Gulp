// Пример использования https://codepen.io/kindyakov/pen/NWJmMZP
// Самое главное чтоб ticker__item был по ширине больше чем родитель если это не так то больше добавлять текста <p>>...текст</p>
{/* <div class="ticker">
  <div class="ticker__wrapper">
    <div class="ticker__item">
      <p>Фиксированная стоимость прописанная в договоре</p>
      <p>Фиксированная стоимость прописанная в договоре</p>
    </div>
  </div>
</div> */}

export function ticker() {
  const tickerWrapper = document.querySelector('.ticker__wrapper');
  let tickerItems = document.querySelector('.ticker__item');

  // Создаем два набора элементов
  tickerWrapper.innerHTML = tickerItems.outerHTML.repeat(2);

  let item1, item2, rect1, rect2, pos1, pos2, rectLeft1

  const speed = 1;

  function updateData(pre = 0) {
    pos1 = 0;
    pos2 = 0;

    item1 = tickerWrapper.children[0]
    item2 = tickerWrapper.children[1]

    item1.style.cssText = ``
    item2.style.cssText = ``

    rect1 = item1.getBoundingClientRect();
    rect2 = item2.getBoundingClientRect();

    rectLeft1 = rect1.left

    item1.style.cssText = `position: absolute; left: ${rect1.left - pre}px;`
    item2.style.cssText = `position: absolute; left: ${rect2.left - pre}px;`
  }

  updateData()

  function animate() {
    pos1 -= speed;
    pos2 -= speed;

    // Если правый конец первого элемента полностью скрывается
    if (pos1 - (speed * 2) <= -(item1.clientWidth + rectLeft1)) {
      const firstItem = tickerWrapper.removeChild(tickerWrapper.children[0]);
      tickerWrapper.appendChild(firstItem);
      updateData()
    }

    tickerWrapper.children[0].style.transform = `translateX(${pos1}px)`;
    tickerWrapper.children[1].style.transform = `translateX(${pos2}px)`;

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(animate)
  }

  animate()
}