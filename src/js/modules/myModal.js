export class Modal {
  constructor(selector, options) {
    let defaultoptions = {
      onOpen: () => { },
      onClose: () => { },
      modalBtnActive: '.modal-btn-active',
      modalBtnClose: '.modal__close',
      classActive: '_active',
      modalContent: 'modal__body',
      isClose: true,
      isAnimation: false
    }
    this.options = Object.assign(defaultoptions, options)
    this.modal = document.querySelector(selector)
    this.speed = 300
    this.isOpen = false
    this.modalContainer = false
    this.fixBocks = document.querySelectorAll('.fix-block')

    this.events()
  }

  events() {
    if (!this.modal) return
    document.addEventListener('click', e => {
      if (e.target.closest(this.options.modalBtnActive)) {
        e.preventDefault()
        this.open(e)
        return
      }

      if (e.target.closest(this.options.modalBtnClose) && this.isOpen) {
        this.options.isClose && this.close()
        return
      }
    })

    this.modal.addEventListener('click', e => {
      if (!e.target.closest(`.${this.options.modalContent}`) && this.isOpen) {
        this.options.isClose && this.close()
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) {
          this.options.isClose && this.close()
        }
      }
    })
  }

  close(selector) {
    this.isOpen = false
    this.modal.classList.remove(this.options.classActive)
    this.options.onClose(this)
    this.enableScroll()
  }

  open(e) {
    setTimeout(() => {
      this.modal.classList.add(this.options.classActive)
      this.disableScroll()

      this.isOpen = true
      this.options.onOpen(e)
    }, 0)
  }

  disableScroll() {
    const pagePos = window.scrollY
    this.lockPadding()
    document.body.classList.add('_lock')
    document.body.dataset.position = pagePos
    // document.body.style.top = pagePos + 'px'
  }

  enableScroll() {
    const pagePos = parseInt(document.body.dataset.position, 10)
    this.unlockPadding()
    document.body.style.top = 'auto'
    document.body.classList.remove('_lock')
    window.scroll({ top: pagePos, left: 0 })
    document.body.removeAttribute('data-position')
  }

  lockPadding() {
    const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px'
    this.modal.style.paddingRight = paddingOffset
    document.querySelector('.wrapper').style.paddingRight = paddingOffset
  }

  unlockPadding() {
    this.modal.removeAttribute('style')
    document.querySelector('.wrapper').style.paddingRight = 0
  }
}

