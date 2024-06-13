export class Modal {
  constructor(selector, options) {
    let defaultoptions = {
      modalBtnClose: '.modal__close',
      classActive: '_active',
      modalContent: 'modal__body',
      isClose: true,
      isAnimation: false,
      unique: false,
      onOpen: () => { },
      onClose: () => { }
    }
    this.options = Object.assign(defaultoptions, options)
    this.modals = document.querySelectorAll('.modal')
    this.speed = 300
    this.isOpen = false
    this.modalContainer = false

    this.mouseDownTarget = null
    this.modalActive = null

    this.onOpen = this.options.onOpen
    this.onClose = this.options.onClose

    this.events()
  }

  events() {
    if (!this.modals.length) return
    document.addEventListener('click', e => {
      if (e.target.closest('[data-modal]')) {
        e.preventDefault()
        this.open(e)
        return
      }

      if (e.target.closest(this.options.modalBtnClose) && this.isOpen) {
        this.options.isClose && this.close()
        return
      }
    })

    document.addEventListener('mousedown', e => {
      this.mouseDownTarget = e.target
    })

    document.addEventListener('mouseup', e => {
      if (this.mouseDownTarget && this.mouseDownTarget === e.target && !e.target.closest(`.${this.options.modalContent}`) && this.isOpen) {
        this.close(e);
      }

      this.mouseDownTarget = null;
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) {
          this.options.isClose && this.close()
        }
      }
    })
  }

  close() {
    if (!this.modalActive) return
    this.isOpen = false
    this.modalActive.classList.remove(this.options.classActive)
    this.onClose(this)
    this.enableScroll()
    this.modalActive = null
  }

  open(e) {
    const btn = e.target.closest('[data-modal]')
    const modalSelector = btn.getAttribute('data-modal')

    if (!modalSelector) {
      console.error('У кнопки не задан селектор модального окна:', btn)
      return
    }

    this.modalActive = document.querySelector(modalSelector)
    if (!this.modalActive) {
      console.error('Модальное окно не найдено по данному селектору:', modalSelector)
      return
    }

    setTimeout(() => {
      this.modalActive.classList.add(this.options.classActive)
      this.disableScroll()

      this.isOpen = true
      this.onOpen(e)
    }, 0)
  }

  disableScroll() {
    const pagePos = window.scrollY
    // this.lockPadding()
    document.body.classList.add('_lock')
    document.body.dataset.position = pagePos
    // document.body.style.top = pagePos + 'px'
  }

  enableScroll() {
    const pagePos = parseInt(document.body.dataset.position, 10)
    // this.unlockPadding()
    document.body.style.top = 'auto'
    document.body.classList.remove('_lock')
    window.scroll({ top: pagePos, left: 0 })
    document.body.removeAttribute('data-position')
  }

  lockPadding() {
    const paddingOffset = window.innerWidth - document.body.offsetWidth
    this.modalActive.style.paddingRight = paddingOffset ? paddingOffset + 'px' : 'none'
    document.querySelector('.wrapper').style.paddingRight = paddingOffset + 'px'
  }

  unlockPadding() {
    this.modalActive.removeAttribute('style')
    document.querySelector('.wrapper').style.paddingRight = 0
  }
}

