export class myModal {
  constructor(selector, options) {
    let defaultoptions = {
      onOpen: () => { },
      onClose: () => { },
      modalbtnActive: '.modal-btn-active',
      classActive: '_active',
      modalContent: 'modal__body'
    }
    this.options = Object.assign(defaultoptions, options)
    this.modal = document.querySelector(selector)
    this.speed = 300
    this.isAnimation = false
    this.isOpen = false
    this.modalContainer = false
    this.fixBocks = document.querySelectorAll('.fix-block')

    this.events()
  }

  events() {
    if (!this.modal) return
    document.addEventListener('click', e => {
      if (e.target.closest(this.options.modalbtnActive)) {
        this.open()
        return
      }

      if (e.target.closest('.modal_close')) {
        this.close()
        return
      }
    })

    this.modal.addEventListener('click', e => {
      if (!e.target.closest(`.${this.options.modalContent}`) && this.isOpen) {
        this.close()
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) {
          this.close()
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

  open(selector) {
    this.modal.classList.add(this.options.classActive)
    this.disableScroll()

    this.isOpen = true
    this.options.onOpen(this)
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
  }

  unlockPadding() {
    this.modal.removeAttribute('style')
  }
}

