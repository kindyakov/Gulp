// Добавить аккордиону класс _my-accordion
// Добавить кнопке для раскритие аккордиона класс _my-accordion-control
// Добавить контенту аккордиона класс _my-accordion-content

export class Accordion {
  constructor(options) {
    let defaultOptions = {
      uniqueName: null,
      isAccordion: true,
      initMaxWidth: 0,
      maxHeight: null,
      accordSelector: '._my-accordion',
      btnSelector: '._my-accordion-control',
      contentSelector: '._my-accordion-content',
      anim: height => [{ maxHeight: 0 }, { maxHeight: height + 'px' }],
      duration: 300,
      easing: 'ease-in-out',
      onOpen: () => { },
      onInit: () => { },
      onEvent: () => { },
      onClose: () => { }
    }

    this.options = Object.assign(defaultOptions, options)
    this.isAnim = false

    this.onOpen = this.options.onOpen
    this.onInit = this.options.onInit
    this.onEvent = this.options.onEvent
    this.onClose = this.options.onClose

    this.init()
  }

  check() {
    if (!this.accords.length) return false

    this.accords.forEach(el => {
      const control = document.querySelector(this.options.btnSelector)
      const content = document.querySelector(this.options.contentSelector)

      if (!control) {
        console.log(el, `Здесь не найден ${this.options.btnSelector}`)
        return false
      }

      if (!content) {
        console.log(el, `Здесь не найден ${this.options.contentSelector}`)
        return false
      }
    })

    return true
  }

  init() {
    if (this.options.uniqueName) {
      this.accords = document.querySelectorAll(`${this.options.accordSelector}[data-special-accordion="${this.options.uniqueName}"]`)
    } else {
      this.accords = document.querySelectorAll(`${this.options.accordSelector}:not([data-special-accordion])`)
    }

    const isSuccess = this.check()

    if (isSuccess) {
      this.accords.forEach(accord => accord.classList.remove('_open'))
      this.events()
      this.onInit(this.accords)
    }
  }

  events() {
    this.accords.forEach(accordion => {
      const accordionControl = accordion.querySelector(this.options.btnSelector)
      const accordionContent = accordion.querySelector(this.options.contentSelector)

      const initMaxWidth = accordion.getAttribute('data-init-max-width') || this.options.initMaxWidth

      accordionControl.addEventListener('click', () => {
        if (initMaxWidth && !window.matchMedia(`(max-width: ${initMaxWidth}px)`).matches) return

        if (!accordion.classList.contains('_open')) {
          this.open(accordion)
        } else {
          this.close()
        }

        this.onEvent(accordion)
      })
    })

    window.addEventListener('resize', () => {
      let windowWidth = window.innerWidth;

      if (this.options.initMaxWidth && this.options.initMaxWidth > windowWidth) {
        this.accords.forEach(el => el.classList.remove('_open'))
      }
    })
  }

  open(accordion) {
    this.options.isAccordion && this.close()

    const accordionContent = accordion.querySelector(this.options.contentSelector)

    const duration = +accordion.getAttribute('data-duration') || this.options.duration
    const easing = accordion.getAttribute('data-easing') || this.options.easing
    const maxHeight = +accordion.getAttribute('data-max-height') || this.options.maxHeight

    const accordionsInner = accordion.querySelectorAll('._my-accordion')
    let addHeight = 0, timer

    accordionsInner.length && accordionsInner.forEach(_accordion => {
      addHeight += _accordion.scrollHeight
    })

    const contentHeight = maxHeight ? maxHeight : accordionContent.scrollHeight
    this.isAnim = true

    accordion.classList.add('_open')

    const animation = accordionContent.animate(
      this.options.anim(contentHeight),
      {
        duration,
        easing,
        fill: 'forwards'
      }
    );

    animation.addEventListener('finish', () => {
      accordionContent.style.maxHeight = (+contentHeight + +addHeight) + 'px';
      this.isAnim = false
      setTimeout(() => {
        animation.effect.updateTiming({ fill: 'none' });
        this.onOpen(accordion)
      })
    });
  }

  close() {
    this.accords.forEach(accordion => {
      const accordionContent = accordion.querySelector(this.options.contentSelector)

      const duration = +accordion.getAttribute('data-duration') || this.options.duration
      const easing = accordion.getAttribute('data-easing') || this.options.easing
      const maxHeight = +accordion.getAttribute('data-max-height') || this.options.maxHeight

      const contentHeight = maxHeight ? maxHeight : accordionContent.scrollHeight

      if (!accordion.classList.contains('_open')) return

      accordion.classList.remove('_open')
      this.isAnim = true

      const animation = accordionContent.animate(
        this.options.anim(contentHeight),
        {
          duration,
          easing,
          direction: 'reverse',
          fill: 'forwards'
        }
      )

      animation.addEventListener('finish', () => {
        accordionContent.style.maxHeight = null
        this.isAnim = false
        setTimeout(() => {
          animation.effect.updateTiming({ fill: 'none' });
          this.onClose(accordion)
        })
      })
    })
  }
}