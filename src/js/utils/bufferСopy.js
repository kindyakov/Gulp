// клас для использования "_copy"
// data-copy="" атрибут для текста у lable

export const bufferСopy = ({ delay = 150, showMS = 1500 }) => {
  const copyItems = document.querySelectorAll('._copy')
  const htmlLabel = text => `<span class="_copy-info">${text}</span>`;

  let isLabel = true;

  const animateShow = [
    { transform: 'translate(-50%, 0)', opacity: '0', visibility: 'hidden' },
    { transform: 'translate(-50%, -10px)', opacity: '1', visibility: 'visible' }
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
      label.style.cssText = `opacity: 1; transform: translate(-50%, -10px);`
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