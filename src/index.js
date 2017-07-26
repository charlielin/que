import Que from 'que'

const que = new Que({
  props: {
    frameworks: [{
      name: 'backbone'
    }, {
      name: 'angular'
    }, {
      name: 'ember'
    }, {
      name: 'react'
    }, {
      name: 'vue'
    }]
  },
  reducers: {
  }
})

que.render('#que-app')
