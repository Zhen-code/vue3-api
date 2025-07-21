import ColorButton from './Button/button'

const plugins = [ColorButton]

const install = function (app, opts = {}) {
  plugins.forEach(plugin => {
    // console.log(plugin.name);
    
    app.component(plugin.name, plugin)
  })
}

export default {
    install
}