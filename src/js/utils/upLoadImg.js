export const upLoadImg = (selector = 'input[type="file"]') => {
  const fileInputs = document.querySelectorAll(selector)

  fileInputs.length && fileInputs.forEach(input => {
    const wp = input.closest('div')
    const img = wp.querySelector('img')
    input.addEventListener('change', e => {

      if (!e.target.files.length || !e.target.files[0].type.match('image')) return
      const reader = new FileReader()
      let file = e.target.files[0]

      reader.onload = e => {
        img.src = e.target.result
      }

      reader.readAsDataURL(file)
    })
  })
}