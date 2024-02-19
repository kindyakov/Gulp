// * Чтобы запустить Tabs нужно обертке или родителю добавить атрибут  data-tabs-init="название"]
// * по умолчание класс для кнопок _my-tabs-btn и для контента класс _my-tabs-content
// * параметр lotOfTabs даёт возможность запустить сразу много табов, для этого нужно каждый таб обернуть div и передать его селектор в lotOfTabs

export class Tabs {
  constructor(selector, options) {
    let defaultOptions = {
      onChange: () => { },
      onInit: () => { },
      btnSelector: '._my-tabs-btn',
      contentSelector: '._my-tabs-content',
      activeIndexTab: 0,
      lotOfTabs: false
    }

    this.options = Object.assign(defaultOptions, options)
    this.selector = selector
    this.tabs = document.querySelector(`[data-tabs-init="${selector}"]`)

    this.tabsBtnActive = null
    this.tabsContentActive = null

    if (this.tabs) {
      this.tabsBtns = this.tabs.querySelectorAll(this.options.btnSelector)
      this.tabsContents = this.tabs.querySelectorAll(this.options.contentSelector)
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

    if (this.tabsBtns.length !== this.tabsContents.length && !this.options.lotOfTabs) {
      console.error('Количество кнопок и элементов табов не совпадает!')
      return false
    }
  }

  init() {
    if (this.options.lotOfTabs && this.options.lotOfTabs.length) {
      const tabsWp = document.querySelectorAll(this.options.lotOfTabs)

      tabsWp.length && tabsWp.forEach((tabWp, i) => {
        let tabsBtn = tabWp.querySelectorAll(this.options.btnSelector)
        let tabsContent = tabWp.querySelectorAll(this.options.contentSelector)

        tabsBtn.length && tabsBtn.forEach((btn, _i) => {
          if (_i === this.options.activeIndexTab) {
            btn.classList.add('_tab-btn-active')
            this.tabsBtnActive = btn
          } else {
            btn.classList.remove('_tab-btn-active')
          }
          btn.setAttribute('data-tabs-btn', `${this.selector}-${i}_${_i}`)
        })

        tabsContent.length && tabsContent.forEach((content, _i) => {
          if (_i === this.options.activeIndexTab) {
            content.classList.add('_tab-content-active')
            this.tabsContentActive = content
          } else {
            content.classList.remove('_tab-content-active')
          }
          content.setAttribute('data-tabs-content', `${this.selector}-${i}_${_i}`)
        })
      })


    } else {
      this.tabsBtns.length && this.tabsBtns.forEach((el, i) => {
        el.classList.remove('_tab-btn-active')
        el.setAttribute('data-tabs-btn', `${this.selector}-${i}`)
      })

      this.tabsContents.length && this.tabsContents.forEach((el, i) => {
        el.classList.remove('_tab-content-active')
        el.setAttribute('data-tabs-content', this.tabsBtns[i].getAttribute('data-tabs-btn'))
      })

      this.tabsBtns[this.options.activeIndexTab].classList.add('_tab-btn-active')
      this.tabsContents[this.options.activeIndexTab].classList.add('_tab-content-active')

      this.tabsBtnActive = this.tabsBtns[this.options.activeIndexTab]
      this.tabsContentActive = this.tabsContents[this.options.activeIndexTab]
    }

    this.options.onInit(this.tabsBtnActive, this.tabsContentActive)
  }

  events() {
    this.tabsBtns.forEach((el, i) => {

      el.addEventListener('click', e => {
        const prevTabBtn = e.currentTarget.parentNode.querySelector(`${this.options.btnSelector}._tab-btn-active`)

        if (e.currentTarget !== prevTabBtn) {
          this.switchTabs(e.currentTarget, prevTabBtn)
        }
      })
    })
  }

  switchTabs(nexTabBtn, prevTabBtn = this.tabs.querySelector(`${this.options.btnSelector}._tab-btn-active`)) {
    if (!nexTabBtn || !prevTabBtn) return

    const prevTabId = prevTabBtn.getAttribute('data-tabs-btn')
    const nextTabId = nexTabBtn.getAttribute('data-tabs-btn')

    const prevTabContent = this.tabs.querySelector(`${this.options.contentSelector}[data-tabs-content="${prevTabId}"]`)
    const nextTabContent = this.tabs.querySelector(`${this.options.contentSelector}[data-tabs-content="${nextTabId}"]`)

    prevTabBtn.classList.remove('_tab-btn-active')
    nexTabBtn.classList.add('_tab-btn-active')

    prevTabContent.classList.remove('_tab-content-active')
    nextTabContent.classList.add('_tab-content-active')

    this.tabsBtnActive = nexTabBtn
    this.tabsContentActive = nextTabContent
    this.options.onChange(nexTabBtn, prevTabBtn, nextTabContent, prevTabContent)
  }
}