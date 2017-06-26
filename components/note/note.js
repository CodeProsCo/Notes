const path = require('path')
const fs = require('fs')
const note = require('../../pages/note/note.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'note.html'),
  getStyleSheet: () => path.join(__dirname, 'note.css'),
  getName: () => 'note-view',

  execute: (params) => {
    const thisId = params.id

    const card = document.getElementById(params.id)
    const star = card.querySelector('.star')

    if (params.fav) {
      star.classList.add('active')
    }

    star.addEventListener('click', (e) => {
      e.stopPropagation()

      const fileLocation = `C:\\notes\\${thisId}.json`

      fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
          return
        }

        const file = JSON.parse(data)

        star.classList.toggle('active')
        file.favourite = star.classList.contains('active')

        fs.writeFile(fileLocation, JSON.stringify(file, null, 2), 'utf-8')
      })
    })

    document.getElementById(thisId).addEventListener('click', () => {
      note.getPage().then((page) => {
        page.render().then(() => {
          const fileLocation = `C:\\notes\\${thisId}.json`

          fs.readFile(fileLocation, 'utf-8', (err, data) => {
            if (err) {
              return
            }

            const file = JSON.parse(data)
            const editor = document.getElementById('editor')

            editor.value = file.text
            editor.setAttribute('data-note-id', thisId)
            editor.focus()

            document.getElementById('title').value = file.title
            document.getElementById('subtitle').value = file.subtitle
            document.getElementById('delete').classList.remove('disabled')
            document.getElementById('share').classList.remove('disabled')
          })
        })
      })
    })
  }
}
