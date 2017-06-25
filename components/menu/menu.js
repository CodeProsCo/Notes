const path = require('path')
const remote = require('electron').remote
const note = require('../../pages/note/note.js')
const notes = require('../../pages/notes/notes.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'menu.html'),
  getStyleSheet: () => path.join(__dirname, 'menu.css'),
  getName: () => 'menu',

  execute: () => {
    document.getElementById('close')
      .addEventListener('click', (e) => remote.getCurrentWindow().close())

    document.getElementById('new-file')
      .addEventListener('click', () => {
        note.getPage().then((page) => {
          page.render()
        })
      })

    document.getElementById('notes').addEventListener('click', () => {
      notes.getPage().then((page) => {
        page.render()
      })
    })

    document.getElementById('tools')
      .addEventListener('click', (e) => {
        remote.getCurrentWindow().webContents.toggleDevTools()

        e.target.classList.toggle('active')
      })

    document.getElementById('notes').click()
  }
}
