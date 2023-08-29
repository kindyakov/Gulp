export class Accordion {
  constructor(selector, options) {
    let deaultOptions = {
      isOpen: () => { },
      isEvent: () => { },
    }
    this.options = Object.assign(deaultOptions, options)
    this.accordWrapper = document.querySelector(selector)
    this.accordSelector = options.btnSelector || '._my-accordion'
    this.accordBtnSelector = options.btnSelector || '._my-accordion-controler'
    this.accordContentSelector = options.contentSelector || '._my-accordion-content'
    this.isAccordion = 'false' === `${options.isAccordion}` ? options.isAccordion : true

    if (this.accordWrapper) {
      this.accords = this.accordWrapper.querySelectorAll(this.accordSelector)
      this.accordBtns = this.accordWrapper.querySelectorAll(this.accordBtnSelector)
      this.accordContents = this.accordWrapper.querySelectorAll(this.accordContentSelector)
    } else {
      return
    }

    const isErr = this.check()

    if (isErr) {
      this.init()
      this.events()
    }
  }

  check() {
    this.accords.forEach(el => {
      const controler = document.querySelector(this.accordBtnSelector)
      const content = document.querySelector(this.accordContentSelector)

      if (!controler) {
        console.log(el, 'В этом Accordion не найден ._my-accordion-controler')
        return false
      }

      if (!content) {
        console.log(el, 'В этом Accordion не найден ._my-accordion-content')
        return false
      }
    })

    return true
  }

  init() {
    this.accords.forEach(el => el.classList.remove('_open'))
    this.accordBtns.forEach(el => el.classList.remove('_open'))
    this.accordContents.forEach(el => el.classList.remove('_open'))
  }

  events() {
    this.accordWrapper.addEventListener('click', e => {
      if (e.target.closest(this.accordBtnSelector)) {
        const accordionTarget = e.target.closest(this.accordSelector)
        const accordionControler = accordionTarget.querySelector(this.accordBtnSelector)
        const accordionContent = accordionTarget.querySelector(this.accordContentSelector)

        if (!accordionTarget.classList.contains('_open')) {
          this.open(accordionTarget, accordionControler, accordionContent)
          this.options.isOpen(e)
        } else {
          accordionTarget.classList.remove('_open')
          accordionContent.style.maxHeight = null
        }
      }
      this.options.isEvent(e)
    })
  }

  open(accordionTarget, accordionControler, accordionContent) {
    this.isAccordion && this.close()
    accordionTarget.classList.add('_open')
    accordionControler.classList.add('_open')
    accordionContent.classList.add('_open')
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