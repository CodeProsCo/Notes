const path = require('path')
const engine = require('../../engine/engine.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'config.html'),
  getStyleSheet: () => path.join(__dirname, 'config.css'),
  getName: () => 'config',

  execute: (params) => {
    engine.setActiveButton('config')

    document.getElementById('encrypt').addEventListener('click', (e) => {
      const checkbox = e.currentTarget.querySelector('input')

      if (checkbox.checked) {
        document.getElementById('encryption-key').classList.remove('disabled')
      } else {
        document.getElementById('encryption-key').classList.add('disabled')
      }
    })

    document.getElementById('encryption-key').querySelector('input').addEventListener('focus', (e) => {
      const input = e.target

      input.type = 'password'
    })

    document.getElementById('encryption-key').querySelector('input').addEventListener('input', (e) => {
      const input = e.target.value
      const field = e.target
      const lowerRegex = new RegExp(/[a-z]/)
      const capitalRegex = new RegExp(/[A-Z]/)
      const numRegex = new RegExp(/[0-9]/)
      const charRegex = new RegExp(/^[a-zA-Z0-9- ]*$/)

      let strength = 0

      if (lowerRegex.test(input)) {
        strength += 20
      }

      if (capitalRegex.test(input)) {
        strength += 20
      }

      if (numRegex.test(input)) {
        strength += 20
      }

      if (!charRegex.test(input)) {
        strength += 20
      }

      if (input.length > 8) {
        strength += 20
      }

      const bar = field.parentNode.querySelector('.bar')

      bar.style.transitionDuration = '300ms'
      bar.style.width = `${strength}%`

      if (strength < 50) {
        field.nextElementSibling.classList.remove('orange')
        field.nextElementSibling.classList.add('red')
      }

      if (strength >= 50) {
        field.nextElementSibling.classList.remove('red')
        field.nextElementSibling.classList.add('orange')
        field.nextElementSibling.classList.remove('green')
      }

      if (strength === 100) {
        field.nextElementSibling.classList.add('green')
      }
    })

    document.getElementById('location').addEventListener('click', (e) => {
      const checkbox = e.currentTarget.querySelector('input')

      if (checkbox.checked) {
        document.getElementById('note-location').classList.remove('disabled')
      } else {
        document.getElementById('note-location').classList.add('disabled')
      }
    })
  },

  getPage: () => {
    return new Promise((resolve) => {
      const page = engine.newPage(module.exports)

      engine.getConfiguration().then((appConfig) => {
        engine.newComponent(module.exports, appConfig).then((cmp) => {
          page.addComponent(cmp, 'config', 'content')

          resolve(page)
        })
      })
    })
  }
}
