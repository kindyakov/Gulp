export class Select {
  constructor(selector, options) {
    let defaultOptions = {
      onChange: () => { },
      selectCustom: '_select-custom',
      selectInput: '.mySelect__input',
      selectList: '.mySelect__list',
      selectOption: '.mySelect__option',
      classActive: '_select',
      activeIndex: 0,
      placeholder: false,
      isDev: false,
      isDisabled: false,
      inputHtml: null
    }

    this.selector = selector
    this.options = Object.assign(defaultOptions, options)
    this.selects = document.querySelectorAll(`select${selector}`)
    this.isActive = false
    this.selectValue = null

    if (this.selects.length) {

    } else {
      this.options.isDev && console.log(`Ошибка: не найден select c классом "${selector}"`)
      return
    }

    this.init()
    this.events()
  }

  init() {
    this.selects.forEach(select => {
      const options = select.querySelectorAll('option')
      const selectName = select.getAttribute('name')

      select.insertAdjacentHTML('afterend', this.customSelectHtml(selectName, options))
      select.style.display = 'none'
    })

    this.selectCustom = document.querySelectorAll(`.mySelect.${this.options.selectCustom}`)
  }

  events() {
    document.addEventListener('click', e => {
      if (!e.target.closest(`.mySelect.${this.options.selectCustom}`)) return
      const select = e.target.closest(`.mySelect.${this.options.selectCustom}`)

      if (select.classList.contains('_disabled')) return

      const selectInput = select.querySelector(this.options.selectInput)
      const selectInputSpan = select.querySelector(`${this.options.selectInput} span`)
      const selectList = select.querySelector(this.options.selectList)

      if (e.target.closest(this.options.selectInput)) {
        // if (select.classList.contains(this.options.classActive) && this.isActive) {
        //   this.close(select, selectList)
        // } else {
        this.open(select, selectList)
        // }
      }

      if (e.target.closest(this.options.selectOption)) {
        const optionValue = e.target.getAttribute('data-value')
        const optionText = e.target.innerText

        selectInputSpan.classList.remove('placeholder')
        selectInputSpan.innerText = optionText
        selectInput.setAttribute('data-value', optionValue)

        this.disableSelectedOption(select)
        this.changeSelectOption(select, optionValue)
        this.close(select, selectList)

        this.options.onChange(e, select, optionValue)
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.selectCustom.forEach(_select => this.close(_select))
      }
    })

    document.addEventListener('click', e => {
      if (!e.target.closest('.mySelect')) {
        this.selectCustom.forEach(_select => this.close(_select))
      }
    })
  }

  open(select, selectList) {
    this.selectCustom.forEach(_select => this.close(_select))
    select.classList.add(this.options.classActive)
    selectList.style.maxHeight = selectList.scrollHeight + 'px'
    this.isActive = true
  }

  close(select) {
    select.classList.remove(this.options.classActive)
    select.querySelector(this.options.selectList).style.maxHeight = null
    this.isActive = false
  }

  disableSelectedOption(select) {
    const selectedOptionValue = select.querySelector(this.options.selectInput).getAttribute('data-value')
    const options = select.querySelectorAll(this.options.selectOption)

    options.forEach(option => {
      let value = option.getAttribute('data-value')
      option.classList.remove('_none')
      option.classList.remove('_option-list')
      option.classList.add('_show')
      if (value === selectedOptionValue) {
        option.classList.add('_none')
        option.classList.remove('_show')
      }
    })

    const optionsShow = select.querySelectorAll(`${this.options.selectOption}._show`)
    optionsShow[optionsShow.length - 1].classList.add('_option-list')

  }

  changeSelectOption(select, optionValue) {
    const selectName = select.getAttribute('data-name')
    const defaultSelect = document.querySelector(`${this.selector}[name="${selectName}"]`)
    if (defaultSelect) {
      defaultSelect.value = optionValue
      this.selectValue = optionValue
    }
  }

  customSelectHtml(name, options) {
    return `<div class="mySelect ${this.options.selectCustom} ${this.options.isDisabled ? '_disabled' : ''}" data-name="${name}">
    <div class="mySelect__input" data-value="${this.options.placeholder && this.options.placeholder.length ? null : options[this.options.activeIndex].value}">${this.options.placeholder && this.options.placeholder.length ? `<span class="placeholder">${this.options.placeholder}</span>` : `<span>${options[this.options.activeIndex].textContent}</span>`} ${this.options.inputHtml && this.options.inputHtml.length ? this.options.inputHtml : ''}</div>
    <ul class="mySelect__list">
    ${Array.from(options).map(option => `<li class="mySelect__option ${options[this.options.activeIndex].value === option.value && !this.options.placeholder ? '_none' : ''}" data-value="${option.value}">${option.textContent}</li>`).join('')}
    </ul >
  </div>`
  }
}