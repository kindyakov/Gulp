export const utilsBurger = (selectorBurger = '.header-burger', selectorNav = '.header__nav') => {
  const burger = document.querySelector(selectorBurger)
  const nav = document.querySelector(selectorNav)
  if (!burger || !nav) return

  burger.addEventListener('click', () => {
    if (burger.classList.contains('_active')) {
      burger.classList.remove('_active')
      nav.classList.remove('_active')
    } else {
      burger.classList.add('_active')
      nav.classList.add('_active')
    }
  })
}

export const utilsHeaderFixed = (selectorBurger = '.header-burger', selectorNav = '.header__nav') => {
  const header = document.querySelector('header')
  const headerBody = document.querySelector('.header__body')
  const burder = document.querySelector(selectorBurger)
  const nav = document.querySelector(selectorNav)

  if (!headerBody || !header) return

  let isFixed = false, headerHeight = header.clientHeight

  window.addEventListener('scroll', () => {
    burder && burder.classList.remove('_active')
    nav && nav.classList.remove('_active')

    if (scrollY > headerHeight && !isFixed) {
      header.style.height = headerHeight + 'px'
      headerBody.style.cssText = `transform: translate(0, -100%);`
      setTimeout(() => {
        isFixed = true
        headerBody.classList.add('_fixed')
        headerBody.style.cssText = `transform: translate(0, 0);`
      }, 200)
    } else if (scrollY === 0) {
      // header.removeAttribute('style')
      headerBody.removeAttribute('style')
      headerBody.classList.remove('_fixed')
      isFixed = false
    }
  })
}

export const utilsScroll = (selectorLinks = '.link-scroll') => {
  const links = document.querySelectorAll(selectorLinks)
  const headerBody = document.querySelector('.header__body')
  const fullPageHeight = Math.max(
    document.body.scrollHeight, // Высота всего документа включая прокрутку
    document.documentElement.scrollHeight, // Высота всего документа для более старых браузеров
    document.body.offsetHeight, // Высота всего документа с учетом отступов (border, padding)
    document.documentElement.offsetHeight // Высота всего документа с учетом отступов для более старых браузеров
  );


  links.length && links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const id = link.getAttribute('href')
      const section = document.querySelector(id)

      if (!section) return
      const sectionTopPos = section.offsetTop - (headerBody ? headerBody.clientHeight + 20 : 0)

      window.scrollTo({ top: sectionTopPos, behavior: 'smooth' });
    })

  })
}