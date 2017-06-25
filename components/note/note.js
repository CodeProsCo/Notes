const path = require('path')
const fs = require('fs')
const note = require('../../pages/note/note.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'note.html'),
  getStyleSheet: () => path.join(__dirname, 'note.css'),
  getName: () => 'note-view',

  execute: (params) => {
    const thisId = params.id

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
