export class Tabs {
  constructor(selector, options) {
    let deaultOptions = {
      isChange: () => { },
      isInit: () => { },
    }

    this.options = Object.assign(deaultOptions, options)
    this.selector = selector
    this.tabs = document.querySelector(`[data-tabs-init="${selector}"]`)
    this.tabsBtnSelector = this.options.btnSelector || '._my-tabs-btn'
    this.tabsContentSelector = this.options.contentSelector || '._my-tabs-content'

    if (this.tabs) {
      this.tabsBtns = this.tabs.querySelectorAll(this.tabsBtnSelector)
      this.tabsContents = this.tabs.querySelectorAll(this.tabsContentSelector)
    } else {
      return false
    }

    this.check()
    this.init()
    this.events()
  }

  check() {
    if (document.querySelectorAll(`[data-tabs-init="${this.selector}"]`).length > 1) {
      console.error('Количество элементов с одинаковым data-tabs-init больше одного!')
      return false
    }

    if (this.tabsBtns.length !== this.tabsContents.length) {
      console.error('Количество кнопок и элементов табов не совпадает!')
      return false
    }
  }

  init() {
    this.tabsBtns.forEach((el, i) => {
      el.classList.remove('_tab-btn-active')
      el.classList.add('_my-tabs-btn')
      el.setAttribute('data-tabs-btn', `${this.selector}-${i}`)
    })

    this.tabsContents.forEach((el, i) => {
      el.classList.remove('_tab-content-active')
      el.classList.add('_my-tabs-content')
      el.setAttribute('data-tabs-content', this.tabsBtns[i].getAttribute('data-tabs-btn'))
    })

    this.tabsBtns[0].classList.add('_tab-btn-active')
    this.tabsContents[0].classList.add('_tab-content-active')

    this.options.isInit()
  }

  events() {
    this.tabsBtns.forEach((el, i) => {
      el.addEventListener('click', e => {
        const currentTabBtn = this.tabs.querySelector('._tab-btn-active')

        if (e.currentTarget !== currentTabBtn) {
          this.switchTabs(e.currentTarget, currentTabBtn)
        }

        this.options.isChange(e)
      })
    })
  }

  switchTabs(nexTabBtn, prevTabBtn = this.tabs.querySelector(`${this.tabsBtnSelector}._tab-btn-active`)) {
    const prevTabId = prevTabBtn.getAttribute('data-tabs-btn')
    const nextTabId = nexTabBtn.getAttribute('data-tabs-btn')

    const prevTabContent = this.tabs.querySelector(`[data-tabs-content="${prevTabId}"]`)
    const nextTabContent = this.tabs.querySelector(`[data-tabs-content="${nextTabId}"]`)

    prevTabBtn.classList.remove('_tab-btn-active')
    nexTabBtn.classList.add('_tab-btn-active')

    prevTabContent.classList.remove('_tab-content-active')
    nextTabContent.classList.add('_tab-content-active')
  }
}