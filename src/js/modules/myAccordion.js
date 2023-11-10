// Добавить аккордиону класс _my-accordion
// Добавить кнопке для раскритие аккордиона класс _my-accordion-controler
// Добавить контенту аккордиона класс _my-accordion-content

export class Accordion {
  constructor(selector, options) {
    let defaultOptions = {
      isOpen: () => { },
      isEvent: () => { },
      onClose: () => { },
      isAccordion: true,
      initMaxWidth: 0
    }
    this.options = Object.assign(defaultOptions, options)
    this.accordWrapper = document.querySelector(selector)
    this.accordSelector = options.btnSelector || '._my-accordion'
    this.accordBtnSelector = options.btnSelector || '._my-accordion-controler'
    this.accordContentSelector = options.contentSelector || '._my-accordion-content'

    if (this.accordWrapper) {
      this.accords = this.accordWrapper.querySelectorAll(this.accordSelector)
      this.accordBtns = this.accordWrapper.querySelectorAll(this.accordBtnSelector)
      this.accordContents = this.accordWrapper.querySelectorAll(this.accordContentSelector)
    } else {
      return
    }

    const isSuccess = this.check()

    if (isSuccess) {
      this.init()
      this.events()
    }
  }

  check() {
    this.accords.forEach(el => {
      const controler = document.querySelector(this.accordBtnSelector)
      const content = document.querySelector(this.accordContentSelector)

      if (!controler) {
        console.log(el, `Здесь ${el} не найден ._my-accordion-controler`)
        return false
      }

      if (!content) {
        console.log(el, `Здесь ${el} не найден ._my-accordion-content`)
        return false
      }
    })

    return true
  }

  init() {
    this.accords = this.accordWrapper.querySelectorAll(this.accordSelector)
    this.accordBtns = this.accordWrapper.querySelectorAll(this.accordBtnSelector)
    this.accordContents = this.accordWrapper.querySelectorAll(this.accordContentSelector)

    this.accords.forEach(el => el.classList.remove('_open'))
    // this.accordBtns.forEach(el => el.classList.remove('_open'))
    // this.accordContents.forEach(el => el.classList.remove('_open'))
  }

  events() {
    this.accordWrapper.addEventListener('click', e => {
      if (e.target.closest(this.accordBtnSelector)) {
        const accordionTarget = e.target.closest(this.accordSelector)
        const accordionControler = accordionTarget.querySelector(this.accordBtnSelector)
        const accordionContent = accordionTarget.querySelector(this.accordContentSelector)

        if (this.options.initMaxWidth && !window.matchMedia(`(max-width: ${this.options.initMaxWidth}px)`).matches) return

        if (!accordionTarget.classList.contains('_open')) {
          this.open(accordionTarget, accordionContent)
          this.options.isOpen(e)
        } else {
          accordionTarget.classList.remove('_open')
          accordionContent.style.maxHeight = null
          this.options.onClose(accordionTarget)
        }
      }
      this.options.isEvent(e)
    })

    window.addEventListener('resize', () => {
      let windowWidth = window.innerWidth;

      if (this.options.initMaxWidth && this.options.initMaxWidth > windowWidth) {
        this.accords.forEach(el => el.classList.remove('_open'))
      }
    })
  }

  open(accordionTarget, accordionContent) {
    this.options.isAccordion && this.close()
    accordionTarget.classList.add('_open')
    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px'
  }

  close() {
    this.accords.forEach(el => el.classList.remove('_open'))
    this.accordBtns.forEach(el => el.classList.remove('_open'))
    this.accordContents.forEach(el => {
      el.classList.remove('_open')
      el.style.maxHeight = null
    })
  }
}