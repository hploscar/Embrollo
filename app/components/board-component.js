import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["ui eigth grid"],
  didUpdateAttrs() {
    this.notifyPropertyChange('matrix')
  },
  actions: {
    updateMatrix(element) {
      this.sendAction('updateMatrix', element)
    },
    boom(element) {
      this.sendAction('boom', element)
    }
  }
});
