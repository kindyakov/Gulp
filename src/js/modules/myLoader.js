export class Loader {
  constructor(wrapper, options) {
    let defaultoptions = {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      styleLoader: '',
      styleWpLoader: '',
      isHidden: true,
      position: 'absolute',
      customSelector: '_custom-loader',
      isCreate: true
    }
    this.options = Object.assign(defaultoptions, options)
    this.wrapper = wrapper
    this.loader
    this.createLoader()
  }

  createLoader() {
    if (this.wrapper) {
      if (!this.wrapper.querySelector(`.wpLoader.${this.options.customSelector}`) && this.options.isCreate) {
        this.wrapper.insertAdjacentHTML('afterbegin', `<div class="wpLoader ${this.options.customSelector}" style="background-color: ${this.options.backgroundColor}; position: ${this.options.position}; ${this.options.styleWpLoader.length ? this.options.styleWpLoader : ''} ">
          <span class="loader" ${this.options.styleLoader.length && `style="${this.options.styleLoader}"`}></span></div>`)
        this.wrapper.style.cssText += `position: relative; ${this.options.isHidden ? 'overflow: hidden;' : ''} `
      }
      this.loader = this.wrapper.querySelector(`.wpLoader`)
    } else {
      // console.log('Ошибка элемент не найден:', this.wrapper)
    }
  }

  enable() {
    this.loader.classList.add('_load')
  }

  disable() {
    this.loader.classList.remove('_load')
  }

  remove() {
    this.loader.remove()
  }
}