// клас для использования "_copy"
// data-copy="" атрибут для текста у lable

const bufferСopy = () => {
  const copyItems = document.querySelectorAll('._copy')
  const htmlLabel = text => `<label class="_copy-info">${text}</label>`;

  let isLabel = true;
  const delay = 150;
  const showMS = 1500;

  const animateShow = [
    { top: '0', opacity: '0', visibility: 'hidden' },
    { top: '-100%', opacity: '1', visibility: 'visible' }
  ];

  const animateFade = [
    { opacity: '1' },
    { opacity: '0' }
  ];

  if (copyItems.length === 0) return

  const removeLabel = (label) => {
    let anim = label.animate(animateFade, { duration: delay })

    anim.addEventListener('finish', () => {
      label.remove();
      isLabel = true;
    })
  }

  const addlabelInfo = (e, infoText) => {
    if (isLabel) {
      e.target.insertAdjacentHTML('beforeend', htmlLabel(infoText))
      isLabel = false;
    }

    const label = e.target.querySelector('._copy-info');
    let anim = label.animate(animateShow, { duration: delay });

    anim.addEventListener('finish', () => {
      label.style.cssText = `opacity: 1; top: -100%;`
      setTimeout(() => removeLabel(label), showMS)
    });
  }

  const handlerCopy = (e) => {
    const infoText = e.target.dataset.copy;
    const text = e.target.textContent;

    navigator.clipboard.writeText(text)
      .then(() => addlabelInfo(e, infoText))
      .catch(err => console.log(err, 'Не удалось скопировать'))
  }

  for (let i = 0; i < copyItems.length; i++) {
    const item = copyItems[i];

    item.addEventListener('click', handlerCopy)
  }
}

export default bufferСopy;