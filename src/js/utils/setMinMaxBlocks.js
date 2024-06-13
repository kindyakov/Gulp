export const setMinMaxBlocks = (selector, { property = 'minWidth', breakpoints = [], breakpointsNone = null } = {}) => {
  const blocks = document.querySelectorAll(selector);
  if (!blocks.length || !['minWidth', 'minHeight', 'maxHeight', 'maxWidth'].includes(property)) return;

  function setNullProperty() {
    blocks.forEach(block => {
      block.style[property] = '';
    });
  }

  // Функция для вычисления и установки минимальной ширины или высоты блоков
  function setProperty() {
    setNullProperty()

    setTimeout(() => {
      const blockSizes = Array.from(blocks).map(block => {
        if (property === 'minWidth' || property === 'maxWidth') {
          return block.getBoundingClientRect().width
        } else {
          return block.getBoundingClientRect().height
        }
      });
      const maxProperty = Math.max(...blockSizes)

      blocks.forEach(block => {
        block.style[property] = maxProperty + 'px'
      })
    }, 200)
  }

  setProperty();

  breakpoints.length && breakpoints.forEach(breakpoint => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    mediaQuery.addEventListener('change', () => {
      mediaQuery.matches && setProperty()
    });

    mediaQuery.matches && setProperty()
  });

  if (breakpointsNone) {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpointsNone}px)`);
    mediaQuery.addEventListener('change', () => {
      mediaQuery.matches && setNullProperty();
    });

    mediaQuery.matches && setNullProperty();
  }
};