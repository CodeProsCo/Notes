const engine = require('../../engine/engine.js')
const menu = require('../../components/menu/menu.js')

engine.newComponent(menu, null).then((component) => {
  component.render('menu', 'nav')
  component.execute()
})
