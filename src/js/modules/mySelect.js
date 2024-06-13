// Для инициализации select использовать класс "init-custom-select"  

export class Select {
  constructor(options) {
    let defaultOptions = {
      uniqueName: null,
      initSelect: '.init-custom-select',
      selectCustom: '_select-custom',
      selectInput: '.mySelect__input',
      selectList: '.mySelect__list',
      selectOption: '.mySelect__option',
      classActive: '_select',
      activeIndex: 0,
      placeholder: '',
      isDev: false,
      isDisabled: false,
      inputHtml: '',
      onInit: () => { },
      onChange: () => { },
      onOpen: () => { },
      onClose: () => { },
    }


    this.options = Object.assign(defaultOptions, options)

    if (this.options.uniqueName) {
      this.selects = document.querySelectorAll(`select[data-special-select="${this.options.uniqueName}"]`)
    } else {
      this.selects = document.querySelectorAll(`select${this.options.initSelect}:not([data-special-select])`)
    }

    this.selectsCustom = []

    if (this.selects.length) {

    } else {
      this.options.isDev && console.log(`Ошибка: не найден select c классом "${this.options.initSelect}"`)
      return
    }

    this.onInit = this.options.onInit
    this.onChange = this.options.onChange
    this.onOpen = this.options.onOpen
    this.onClose = this.options.onClose

    this.init()
  }

  init() {
    this.selectsCustom = []

    this.selects.forEach(select => {
      const options = select.querySelectorAll('option')
      const selectName = select.getAttribute('name')

      const selectCustom = select.getAttribute('data-special-select') || this.options.selectCustom
      const activeIndex = select.getAttribute('data-active-index') || this.options.activeIndex
      const placeholder = select.getAttribute('data-placeholder') || this.options.placeholder
      const isDisabled = select.getAttribute('data-disabled') != null ? true : this.options.isDisabled
      const inputHtml = select.getAttribute('data-input-html') || this.options.inputHtml

      const customSelect = this.customSelectHtml({ selectName, selectCustom, options, activeIndex, placeholder, isDisabled, inputHtml })

      select.insertAdjacentElement('afterend', customSelect)
      select.style.display = 'none'

      this.selectsCustom.push(customSelect)
    })

    this.events()
    this.onInit(this.selectsCustom)
  }

  events() {
    this.selectsCustom.length && this.selectsCustom.forEach(select => {
      const selectInput = select.querySelector(this.options.selectInput)
      const selectInputSpan = select.querySelector(`${this.options.selectInput} span`)

      select.addEventListener('click', e => {
        if (select.classList.contains('_disabled')) return

        if (e.target.closest(this.options.selectInput)) {
          if (select.classList.contains(this.options.classActive)) {
            this.close(select)
          } else {
            this.open(select)
          }
        }

        if (e.target.closest(this.options.selectOption)) {
          const option = e.target.closest(this.options.selectOption)

          const optionValue = option.getAttribute('data-value')
          const optionText = option.innerText

          selectInputSpan.classList.remove('placeholder')
          selectInputSpan.innerText = optionText
          selectInput.setAttribute('data-value', optionValue)

          this.disableSelectedOption(select)
          this.changeSelectOption(select, optionValue)
          this.close(select)

          this.onChange(e, select, optionValue)
        }
      })
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.selectsCustom.forEach(_select => this.close(_select))
      }
    })

    document.addEventListener('click', e => {
      if (!e.target.closest('.mySelect')) {
        this.selectsCustom.forEach(_select => this.close(_select))
      }
    })
  }

  open(select) {
    const selectList = select.querySelector(this.options.selectList)

    this.selectsCustom.forEach(_select => this.close(_select))
    select.classList.add(this.options.classActive)
    selectList.style.maxHeight = selectList.scrollHeight + 'px'

    this.onOpen(select)
  }

  close(select) {
    select.classList.remove(this.options.classActive)
    select.querySelector(this.options.selectList).style.maxHeight = null

    this.onClose(select)
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
    const defaultSelect = document.querySelector(`${this.options.initSelect}[name="${selectName}"]`)
    if (defaultSelect) {
      defaultSelect.value = optionValue
      this.selectValue = optionValue
    }
  }

  customSelectHtml({ selectName, selectCustom, options, activeIndex, placeholder, isDisabled, inputHtml }) {
    const mySelect = document.createElement("div")

    mySelect.classList.add('mySelect')
    mySelect.classList.add(selectCustom)
    isDisabled && mySelect.classList.add('_disabled')
    mySelect.setAttribute('data-name', selectName)

    mySelect.innerHTML = `<div class="mySelect__input" data-value="${placeholder.length ? '' : options[activeIndex].value}">${placeholder.length ? `<span class="placeholder">${placeholder}</span>` : `<span>${options[activeIndex].textContent}</span>`} ${inputHtml.length ? inputHtml : ''}</div>
    <ul class="mySelect__list">
    ${Array.from(options).map(option => `<li class="mySelect__option ${options[activeIndex].value === option.value && !placeholder ? '_none' : ''}" data-value="${option.value}">${option.textContent}</li>`).join('')}
    </ul>`

    return mySelect
  }
}