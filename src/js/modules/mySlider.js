export class SliderAdaptive {
  constructor(selector, options) {
    let defaultOptions = {
      onInit: () => { },
      onDestroy: () => { },
      isDev: false,
      maxWidth: 0,
      swiperOptions,
    }
    this.sreenWidth = window.screen.width
    this.options = Object.assign(defaultOptions, options)

    this.sliderSelector = selector
    this.slider = document.querySelector(selector)
    this.swiper = null

    if (this.slider) {
      this.sliderWrapper = this.slider.children[0]
      this.sliderSlides = this.sliderWrapper.children
    } else {
      this.options.isDev && console.log(`Слайдер не найде по селектору ${selector}`)
      return
    }

    this.onInit = this.options.onInit
    this.onDestroy = this.options.onDestroy

    this.events()
    if (this.sreenWidth < this.options.maxWidth) {
      this.init()
    }
  }

  events() {
    window.addEventListener('resize', () => {
      this.sreenWidth = window.screen.width

      if (this.sreenWidth < this.options.maxWidth) {
        this.init()
      } else {
        this.destroy()
      }
    })
  }

  init() {
    if (this.slider.classList.contains('_slider-init')) return
    this.slider.classList.add('_slider-init')
    this.slider.classList.add('swiper')
    this.sliderWrapper.classList.add('swiper-wrapper')
    Array.from(this.sliderSlides).forEach(slide => slide.classList.add('swiper-slide'));

    this.swiper = new Swiper(this.sliderSelector, this.options.swiperOptions)

    this.onInit()
  }

  destroy() {
    if (!this.swiper) return
    this.slider.classList.remove('_slider-init')
    this.slider.classList.remove('swiper')
    this.sliderWrapper.classList.remove('swiper-wrapper')
    Array.from(this.sliderSlides).forEach(slide => slide.classList.remove('swiper-slide'));

    this.swiper.destroy(true, true);

    this.onDestroy()
  }
}