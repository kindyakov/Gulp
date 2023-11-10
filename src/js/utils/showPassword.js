export const showPassword = selector => {
  const elemts = document.querySelectorAll(selector)

  function changeType() {
    elemts.forEach(el => {
      const wp = el.parentElement
      const input = wp.querySelector('input')
      input.setAttribute('type', 'password')
    })
  }

  elemts.length && elemts.forEach(el => {
    const wp = el.closest('.wpInput')
    const input = wp.querySelector('input[type="password"]')

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      el.classList.add('_show')
    } else {
      input.addEventListener('mouseover', () => {
        el.classList.add('_show')
      })

      input.addEventListener('mouseout', () => {
        el.classList.remove('_show')
      })
    }

    el.addEventListener('click', (e) => {
      const wp = el.parentElement
      const input = wp.querySelector('input')

      if (input.getAttribute('type') === 'text') {
        input.setAttribute('type', 'password')
      } else {
        changeType()
        input.setAttribute('type', 'text')
      }
    })
  })
}