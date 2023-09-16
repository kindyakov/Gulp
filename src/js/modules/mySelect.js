export class Select {
  constructor(selector, options) {
    let defaultOptions = {
      onChange: () => { },
      selectCustom: '._select-custom',
      selectInput: '.mySelect__input',
      selectList: '.mySelect__list',
      selectOption: '.mySelect__option',
      classActive: '_select',
      isDev: false,
    }

    this.options = Object.assign(defaultOptions, options)
    this.selects = document.querySelectorAll(selector)
    this.isSelect = false

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

      select.insertAdjacentHTML('afterend', this.custonSelectHtml(selectName, options))
      select.style.display = 'none'
    })

    this.custonSelects = document.querySelectorAll('.mySelect')
  }

  events() {
    this.custonSelects.forEach(select => {
      select.addEventListener('click', e => {
        const selectInput = select.querySelector(this.options.selectInput)
        const selectList = select.querySelector(this.options.selectList)

        if (e.target.closest(this.options.selectInput)) {
          if (select.classList.contains(this.options.classActive)) {
            this.close(select, selectList)
          } else {
            this.open(select, selectList)
          }
        }

        if (e.target.closest(this.options.selectOption)) {
          const optionValue = e.target.innerText
          selectInput.innerText = optionValue
          selectInput.setAttribute('data-value', optionValue)
          this.disableSelectedOption(select)
          this.changeSelectOption(select, optionValue)
          this.close(select, selectList)

          this.options.onChange()
        }
      })
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.custonSelects.forEach(_select => this.close(_select))
      }
    })

    document.addEventListener('click', e => {
      if (!e.target.closest('.mySelect')) {
        this.custonSelects.forEach(_select => this.close(_select))
      }
    })
  }

  open(select, selectList) {
    this.custonSelects.forEach(_select => this.close(_select))
    select.classList.add(this.options.classActive)
    selectList.style.maxHeight = selectList.scrollHeight + 'px'
    this.isSelect = true
  }

  close(select) {
    select.classList.remove(this.options.classActive)
    select.querySelector(this.options.selectList).style.maxHeight = null
    this.isSelect = false
  }

  disableSelectedOption(select) {
    const selectedOptionValue = select.querySelector(this.options.selectInput).getAttribute('data-value')
    const options = select.querySelectorAll(this.options.selectOption)

    options.forEach(option => {
      const value = option.getAttribute('data-value')
      option.classList.remove('_none')
      value === selectedOptionValue && option.classList.add('_none')
    })
  }

  changeSelectOption(select, optionValue) {
    const selectName = select.getAttribute('data-name')
    const defaultSelect = document.querySelector(`${this.options.selectCustom}[name="${selectName}"]`)
    defaultSelect.value = optionValue
  }

  custonSelectHtml(name, options) {
    return `<div class="mySelect" data-name="${name}">
    <div class="mySelect__input" data-value="${options[0].value}">${options[0].value}</div>
    <ul class="mySelect__list">
    ${Array.from(options).map(option => `<li class="mySelect__option ${options[0].value === option.value ? '_none' : ''}" data-value="${option.value}">${option.value}</li>`).join('')}
    </ul >
  </div > `
  }
}