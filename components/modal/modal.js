const path = require('path')
module.exports = {
  getTemplate: () => path.join(__dirname, 'modal.html'),
  getStyleSheet: () => path.join(__dirname, 'modal.css'),
  getName: () => 'modal',

  execute: (params) => {
    const dimmer = document.getElementById('dimmer')
    const modal = document.getElementById(params.id)

    dimmer.classList.add('visible')
    dimmer.classList.add('active')
    modal.classList.add('visible')
    modal.classList.add('active')

    document.getElementById('modal-close').addEventListener('click', () => {
      dimmer.classList.remove('visible')
      dimmer.classList.remove('active')
      modal.classList.remove('visible')
      modal.classList.remove('active')

      const cmp = modal.closest('component')

      cmp.parentElement.removeChild(cmp)
    })
  }
}
