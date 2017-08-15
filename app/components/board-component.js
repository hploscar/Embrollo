import Ember from 'ember';

export default Ember.Component.extend({
  // counterSize: 0,
  willInsertElement() {
    // let width = Ember.$('.matrix').width()
    // console.log(width)
    // let columns = 0
    // this.set('counterSize', Math.floor(width / 10))
    // this.set('columns', Math.floor(width / this.get('counterSize')))
    // console.log(this.get('columns'))
  },
  actions: {
    updateMatrix(element) {
      this.sendAction('updateMatrix', element)
    }
  }
});
