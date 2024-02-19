export const maxHeightBlocks = (selector) => {
  const blocks = document.querySelectorAll(selector)

  if (blocks.length) {
    let blockHeight = Array.from(blocks).map(block => block.getBoundingClientRect().height)
    let maxHeight = Math.max(...blockHeight)

    blocks.length && blocks.forEach(block => {
      block.style.minHeight = maxHeight + 'px'
    })
  }
}

export const maxWidthBlocks = (selector) => {
  const blocks = document.querySelectorAll(selector)

  if (blocks.length) {
    let blockWidth = Array.from(blocks).map(block => block.getBoundingClientRect().width)
    let maxWidth = Math.max(...blockWidth)

    blocks.length && blocks.forEach(block => {
      block.style.minWidth = maxWidth + 'px'
    })
  }
}