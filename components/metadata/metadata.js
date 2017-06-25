const path = require('path')

module.exports = {
  getTemplate: () => path.join(__dirname, 'metadata.html'),
  getStyleSheet: () => path.join(__dirname, 'metadata.css'),
  getName: () => 'metadata',

  execute: () => {
    document.getElementById('editor').addEventListener('input', (e) => {
    })
  }
}
