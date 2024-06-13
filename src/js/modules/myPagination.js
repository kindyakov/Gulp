export class Pagination {
  constructor(wrap, options) {
    let defaultoptions = {
      page: null,
      pages: null,
      visibleMaxButtons: 5,
      visibleButtons: 3,
      isInitPaging: false,
      position: 'beforeend',
      classPagging: 'myPagination',
      onChange: () => { },
      onInit: () => { },
      onInitPaging: () => { }
    }
    this.options = Object.assign(defaultoptions, options)

    this.onChange = () => { }
    this.onInit = () => { }
    this.onInitPaging = () => { }

    this.paggingHtml = () => {
      return `<div class="pagging ${this.options.classPagging} _none">
	<button class="pagging__arrow left _disabled">
		<svg class="icon">
			<use xlink:href="img/svg/sprite.svg#arrow"></use>
		</svg>
	</button>
	<ul class="pagging__list">

	</ul>
	<button class="pagging__arrow right">
		<svg class="icon">
			<use xlink:href="img/svg/sprite.svg#arrow"></use>
		</svg>
	</button>
</div>`
    }
    this.paggingLiHtml = (page, i) => {
      return `<li class="pagging__li"><button class="pagging__item ${page === i ? '_active' : ''}" data-page="${i}">${i}</button></li>`
    }
    this.pagging = null
    this.paggingList = null
    this.paggingPrev = null
    this.paggingNext = null
    this.paggingItem = null

    if (!wrap) return

    this.init(wrap)
    this.event()
  }

  init(wrap) {
    if (wrap) {
      wrap.insertAdjacentHTML(this.options.position, this.paggingHtml())

      this.pagging = document.querySelector(`.pagging.${this.options.classPagging}`)
      this.paggingList = this.pagging.querySelector('.pagging__list')
      this.paggingPrev = this.pagging.querySelector('.pagging__arrow.left')
      this.paggingNext = this.pagging.querySelector('.pagging__arrow.right')

      this.onInit()
    }
  }

  initPaging(pages, page) {
    if (!this.pagging || this.options.isInitPaging) return

    this.pagging.classList.remove('_none')
    this.paggingList.innerHTML = ''

    for (let i = 1; i <= pages; i++) {
      if (i > this.options.visibleMaxButtons) {
        this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li">...</li>`)
        this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li"><button class="pagging__item ${page === i ? '_active' : ''}" data-page="${pages}">${pages}</button></li>`)
        break
      }
      this.paggingList.insertAdjacentHTML('beforeend', this.paggingLiHtml(page, i))
    }

    this.options.page = +page
    this.options.pages = +pages

    this.paggingBtn = this.paggingList.querySelectorAll('.pagging__item')
    this.options.isInitPaging = true

    this.changeClassPrevNext(this.options.pages, this.options.page)
    this.onInitPaging()
  }

  event() {
    this.pagging.addEventListener('click', e => {
      if (e.target.closest('.pagging__item')) {
        const currentBtn = e.target.closest('.pagging__item')
        const prevBtn = this.paggingList.querySelector('.pagging__item._active')
        const page = currentBtn.getAttribute('data-page')

        this.options.page = Number(page)

        if (currentBtn !== prevBtn) {
          prevBtn && prevBtn.classList.remove('_active')
          currentBtn && currentBtn.classList.add('_active')

          this.changePagging(this.options.pages, this.options.page)
          this.changeClassPrevNext(this.options.pages, this.options.page)
          this.onChange({ currentBtn, prevBtn, page: this.options.page })
        }
      }

      if (e.target.closest('.pagging__arrow:not(._disabled)')) {
        const btn = e.target.closest('.pagging__arrow:not(_disabled)')
        let page;

        if (btn === this.paggingPrev) {
          const prevBtn = this.paggingList.querySelector(`.pagging__item[data-page="${this.options.page}"]`)
          const currentBtn = this.paggingList.querySelector(`.pagging__item[data-page="${--this.options.page}"]`)

          prevBtn && prevBtn.classList.remove('_active')
          currentBtn && currentBtn.classList.add('_active')

          this.changePagging(this.options.pages, this.options.page)
          this.changeClassPrevNext(this.options.pages, this.options.page)
          this.onChange({ currentBtn, prevBtn, page: this.options.page })
        } else if (btn === this.paggingNext) {
          const prevBtn = this.paggingList.querySelector(`.pagging__item[data-page="${this.options.page}"]`)
          const currentBtn = this.paggingList.querySelector(`.pagging__item[data-page="${++this.options.page}"]`)

          prevBtn && prevBtn.classList.remove('_active')
          currentBtn && currentBtn.classList.add('_active')

          this.changePagging(this.options.pages, this.options.page)
          this.changeClassPrevNext(this.options.pages, this.options.page)
          this.onChange({ currentBtn, prevBtn, page: this.options.page })
        }
      }
    })
  }

  changeClassPrevNext(pages, page) {
    if (+page === 1) {
      this.paggingPrev.classList.add('_disabled')
    } else {
      this.paggingPrev.classList.remove('_disabled')
    }

    if (+page === +pages) {
      this.paggingNext.classList.add('_disabled')
    } else {
      this.paggingNext.classList.remove('_disabled')
    }
  }

  changePagging(pages, page) {
    if (pages < 6) return
    this.paggingList.innerHTML = ''

    if (page < 3) {
      for (let i = 1; i <= pages; i++) {
        if (i > this.options.visibleMaxButtons) {
          this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li">...</li>`)
          this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li"><button class="pagging__item" data-page="${pages}">${pages}</button></li>`)
          break
        }
        this.paggingList.insertAdjacentHTML('beforeend', this.paggingLiHtml(page, i))
      }
    } else if (page > 2 && page <= pages - this.options.visibleButtons) {
      let index = page === 3 ? 3 : page - 1,
        showPages = page === 3 ? this.options.visibleButtons + page : this.options.visibleButtons + page - 1

      if (page >= pages - (this.options.visibleMaxButtons - 1)) {
        index = pages - (this.options.visibleMaxButtons - 1)
        showPages = pages - 1
      }

      this.paggingList.insertAdjacentHTML('beforeend', this.paggingLiHtml(page, 1))
      this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li">...</li>`)

      for (let i = index; i < showPages; i++) {
        this.paggingList.insertAdjacentHTML('beforeend', this.paggingLiHtml(page, i))
      }

      this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li">...</li>`)
      this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li"><button class="pagging__item" data-page="${pages}">${pages}</button></li>`)
    } else if (page > pages - this.options.visibleButtons) {
      this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li"><button class="pagging__item" data-page="${1}">${1}</button></li>`)
      this.paggingList.insertAdjacentHTML('beforeend', `<li class="pagging__li">...</li>`)

      for (let i = pages - (this.options.visibleMaxButtons - 1); i <= pages; i++) {
        this.paggingList.insertAdjacentHTML('beforeend', this.paggingLiHtml(page, i))
      }
    }
  }
}
