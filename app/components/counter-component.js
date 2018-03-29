import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["two wide column"],
  valueObserver: Ember.observer('value', function() {
    if (this.get('value') == 0) {
      this.$(`[ref=${this.get('counter')}]`).removeClass(`color-4`)
      this.$(`[ref=${this.get('counter')}]`).addClass(`color-0`)
    } else {
      if (this.get('value') > 4) {
        this.set('value', 0)
        this.sendAction('boom', this.get('counter'))
      } else {
        this.$(`[ref=${this.get('counter')}]`).removeClass(`color-${this.get('value') - 1}`)
        this.$(`[ref=${this.get('counter')}]`).addClass(`color-${this.get('value')}`)
      }
    }
  }),
  didInsertElement() {
    this.set('value', this.get('matrix')[this.get('counter')].value)
    this.$(`[ref=${this.get('counter')}]`).addClass(`color-${this.get('value')}`)
  },
  // didUpdateAttrs() {
    // this.set('value', this.get('matrix')[this.get('counter')].value)
    // this.$(`[ref=${this.get('counter')}]`).addClass(`color-${this.get('value')}`)
  // },
  actions: {
    push() {
      if (this.get('value') > 0) {
        // this.set('value', this.get('value') + 1)
        this.sendAction('updateMatrix', this.get('counter'))
      }
    }
  }
});
