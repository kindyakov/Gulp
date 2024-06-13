export class Tabs {
  _groupedElements;
  _groupedButtons;
  _groupedContents;
  _buttonsActive;
  _contentsActive;

  constructor(options) {
    const defaultOptions = {
      specialSelector: '._my-tab-special',
      btnSelector: '._my-tab-btn',
      contentSelector: '._my-tab-content',
      classBtnActive: '_tab-btn-active',
      classContentActive: '_tab-content-active',
      activeIndexTab: 0,
      isCheck: true,
      uniqueName: false,
      onChange: () => { },
      onInit: () => { },
    }

    this.options = Object.assign(defaultOptions, options)

    this._groupedElements = []
    this._groupedButtons = []
    this._groupedContents = []

    this._buttonsActive = new Set()
    this._contentsActive = new Set()

    this.clickHandler = this.clickHandler.bind(this)

    this.onChange = this.options.onChange
    this.onInit = this.options.onInit

    this.init()
  }

  // tabs.buttonsActive и вернет массив с активными кнопками
  get buttonsActive() {
    return Array.from(this._buttonsActive)
  }

  // tabs.buttonsActive и вернет массив с активными контентами
  get contentActive() {
    return Array.from(this._contentsActive)
  }

  check() {
    let isError = false

    this.tabButtons.forEach(btn => {
      const dataTabStr = btn.getAttribute('data-tab-btn')

      if (!dataTabStr) {
        throw new Error(`Плагин myTabs: нет атрибута [data-tab-btn] или он пустой у кнопки ${btn}`)
      }

      const [tabName, id] = dataTabStr.split(',')

      if (!tabName) {
        throw new Error(`Плагин myTabs: В атрибуте [data-tab-btn="?,${id}"] не указан "name" у кнопки ${btn}`)
      }

      if (!id) {
        throw new Error(`Плагин myTabs: В атрибуте [data-tab-btn="${tabName},?"] не указан "id" контента у кнопки ${btn}`)
      }
    })

    this.tabContents.forEach(content => {
      const dataTabStr = content.getAttribute('data-tab-content')

      if (!dataTabStr) {
        throw new Error(`Плагин myTabs: нет атрибута [data-tab-content] или он пустой у блока ${content}`)
      }

      const [tabName, id] = dataTabStr.split(',')

      if (!tabName) {
        throw new Error(`Плагин myTabs: В атрибуте [data-tab-content="?,${id}"] не указан "name" у блока ${content}`)
      }

      if (!id) {
        throw new Error(`Плагин myTabs: В атрибуте [data-tab-content="${tabName},?"] не указан "id" кнопки у блока ${content}`)
      }
    })

    return isError
  }

  init() {
    if (this.options.uniqueName) {
      this.tabButtons = document.querySelectorAll(`${this.options.btnSelector}${this.options.specialSelector}`)
      this.tabContents = document.querySelectorAll(`${this.options.contentSelector}${this.options.specialSelector}`)
    } else {
      this.tabButtons = document.querySelectorAll(`${this.options.btnSelector}:not(${this.options.specialSelector})`)
      this.tabContents = document.querySelectorAll(`${this.options.contentSelector}:not(${this.options.specialSelector})`)
    }

    if (!this.tabButtons.length || !this.tabContents.length) return

    const isError = this.options.isCheck ? this.check() : false

    if (isError) return

    // группировка кнопок и контента
    this.groupElements(this.tabButtons, this._groupedButtons, 'data-tab-btn')
    this.groupElements(this.tabContents, this._groupedContents, 'data-tab-content')

    // Этот цикл проходит по каждой группе кнопок в _groupedButtons. Для каждой группы он определяет активную кнопку (либо первую кнопку с атрибутом data-tab-active, либо кнопку с индексом this.options.activeIndexTab)
    this._groupedButtons.forEach(buttons => {
      let tabActiveIndex = null

      buttons.forEach((btn, i) => {
        btn.classList.remove(this.options.classBtnActive)

        if (btn.getAttribute('data-tab-active') === '' && tabActiveIndex === null) {
          tabActiveIndex = i
        }
      })

      tabActiveIndex = tabActiveIndex !== null ? tabActiveIndex : this.options.activeIndexTab

      const activeBtn = buttons[tabActiveIndex]
      const [tabName, id] = activeBtn.getAttribute('data-tab-btn').split(',')
      const activeContent = document.querySelector(`${this.options.contentSelector}[data-tab-content="${tabName},${id}"]`)

      activeBtn.classList.add(this.options.classBtnActive)
      this._buttonsActive.add(activeBtn)

      activeContent.classList.add(this.options.classContentActive)
      this._contentsActive.add(activeContent)
    })

    this._groupedElements = Array.from(this.tabButtons).reduce((acc, btn) => {
      const [tabName] = btn.getAttribute('data-tab-btn').split(',');
      if (!acc[tabName]) {
        acc[tabName] = { buttons: [], contents: [] };
      }
      acc[tabName].buttons.push(btn);
      return acc;
    }, {});

    this.tabContents.forEach(content => {
      const [contentTabName] = content.getAttribute('data-tab-content').split(',');
      if (this._groupedElements[contentTabName]) {
        this._groupedElements[contentTabName].contents.push(content);
      }
    });

    this.event()
    this.onInit(this)
  }

  clickHandler(e) {
    let [tabName] = e.currentTarget.getAttribute('data-tab-btn').split(',')
    let prevTabBtn = null

    prevTabBtn = document.querySelector(`${this.options.btnSelector}[data-tab-name="${tabName}"]._tab-btn-active`)

    if (e.currentTarget !== prevTabBtn) {
      this.switchTabs(e.currentTarget, prevTabBtn)
    }
  }

  event() {
    this.tabButtons.forEach((el, i) => {
      // Удаляем старый обработчик событий, если он есть
      el.removeEventListener('click', this.clickHandler)

      // Добавляем новый обработчик событий
      el.addEventListener('click', this.clickHandler)
    })
  }

  switchTabs(nextTabBtn, prevTabBtn = document.querySelector(`${this.options.btnSelector}[data-tab-name="${nextTabBtn.getAttribute('data-tab-name')}"]._tab-btn-active`)) {
    if (!nextTabBtn || !prevTabBtn) return

    const [tabName, nextTabId] = nextTabBtn.getAttribute('data-tab-btn').split(',')
    const prevTabId = prevTabBtn.getAttribute('data-tab-id')

    const prevTabContent = document.querySelector(`${this.options.contentSelector}[data-tab-content="${tabName},${prevTabId}"]`)
    const nextTabContent = document.querySelector(`${this.options.contentSelector}[data-tab-content="${tabName},${nextTabId}"]`)

    prevTabBtn.classList.remove(this.options.classBtnActive)
    nextTabBtn.classList.add(this.options.classBtnActive)

    prevTabContent.classList.remove(this.options.classContentActive)
    nextTabContent.classList.add(this.options.classContentActive)

    this._buttonsActive.delete(prevTabBtn);
    this._buttonsActive.add(nextTabBtn);

    this._contentsActive.delete(prevTabContent);
    this._contentsActive.add(nextTabContent);

    this.onChange({ nextTabBtn, prevTabBtn, nextTabContent, prevTabContent })
  }

  // Этот метод проходит по каждому элементу и группирует их по tabName, создавая новые группы. Результатом является массив групп, где каждая группа содержит элементы с одинаковым tabName
  groupElements(elements, _groupedElements, dataAttr) {
    elements.forEach(element => {
      const [tabName, id] = element.getAttribute(dataAttr).split(',')
      let group = _groupedElements.find(group => group.length > 0 && group[0].getAttribute(dataAttr).split(',')[0] === tabName)

      if (!group) {
        group = []
        _groupedElements.push(group)
      }

      group.push(element)

      element.setAttribute('data-tab-name', tabName)
      element.setAttribute('data-tab-id', id)
    })
  }
}