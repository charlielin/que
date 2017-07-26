import Que from 'que'

const frameworks = ['backbone', 'angular', 'ember', 'react', 'vue']

const que = new Que({
  props: {
    framework: 'vue'
  },
  reducers: {
    randomFramework: function (e) {
      let framework = frameworks[parseInt(Math.random() * frameworks.length)]
      while (this.framework === framework) {
        framework = frameworks[parseInt(Math.random() * frameworks.length)]
      }
      this.framework = framework
    }
  }
})

que.render('#que-app')
