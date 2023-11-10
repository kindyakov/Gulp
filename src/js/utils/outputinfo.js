// msg - текст ответа от сервера или какое-либо саобщение
// msg_type - тип ответа или сообщения

export const outputInfo = ({ msg = 'Нет текста ответа', msg_type }) => {
  const body = document.body
  const animateShow = [
    { transform: 'translate(-50%, -100%)', opacity: '0', visibility: 'hidden' },
    { transform: 'translate(-50%, 20px)', opacity: '1', visibility: 'visible' }
  ];

  let outputInfo = document.querySelector('.output-info')
  let duration = 300, removeTime = 4000, spanArr = [], gap = 10


  if (!outputInfo) {
    body.insertAdjacentHTML('beforeend', `<div class="output-info _active"></div>`)
    outputInfo = document.querySelector('.output-info')
  } else {
    outputInfo.classList.add('_active')
    spanArr = outputInfo.querySelectorAll('.output-info__span')
  }

  outputInfo.insertAdjacentHTML('afterbegin', `<span class="output-info__span" data-top="20">${msg}</span>`)

  const span = outputInfo.querySelector('.output-info__span')
  const spanHeight = span.getBoundingClientRect().height

  const anim = span.animate(animateShow, { duration: duration });
  anim.addEventListener('finish', finishAnim);

  addGap()

  if (msg_type === 'success') {
    span.classList.add('_success')
  } else if (msg_type === 'error') {
    span.classList.add('_error')
  } else if (msg_type === 'warning') {
    span.classList.add('_warning')
  } else {
    span.classList.add('_error')
  }

  function addGap() {
    spanArr.length && spanArr.forEach(el => {
      let top = +el.getAttribute('data-top') + spanHeight + gap
      el.setAttribute('data-top', top)
      if (!el.classList.contains('_remove')) {
        el.style.cssText = `transform: translate(-50%, ${top}px);`
      }
    });
  }

  function finishAnim() {
    span.style.cssText = `transform: translate(-50%, 20px);`

    setTimeout(() => {
      span.style.cssText = `transform: translate(-50%, ${span.dataset.top}px) scale(0); opacity: 0`
      span.classList.add('_remove')
      setTimeout(() => {
        span.remove()
        !outputInfo.children.length && outputInfo.classList.remove('_active')
      }, duration)
    }, removeTime)
  }
}