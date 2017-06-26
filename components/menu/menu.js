const path = require('path')
const remote = require('electron').remote

const note = require('../../pages/note/note.js')
const notes = require('../../pages/notes/notes.js')
const config = require('../../pages/config/config.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'menu.html'),
  getStyleSheet: () => path.join(__dirname, 'menu.css'),
  getName: () => 'menu',

  execute: () => {
    const menuText = document.getElementById('title-text')

    document.getElementById('close')
      .addEventListener('click', (e) => remote.getCurrentWindow().close())

    document.getElementById('new-file')
      .addEventListener('click', () => {
        menuText.innerHTML = 'New Note'
        note.getPage().then((page) => {
          page.render()
        })
      })

    document.getElementById('notes').addEventListener('click', () => {
      menuText.innerHTML = 'My Notes'
      notes.getPage().then((page) => {
        page.render()
      })
    })

    document.getElementById('config').addEventListener('click', () => {
      menuText.innerHTML = 'Configuration'
      config.getPage().then((page) => {
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
