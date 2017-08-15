import Ember from 'ember';

export default Ember.Component.extend({
  valueObserver: Ember.observer('value', function(sender, key, value, rev) {
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
    // let size = Ember.$(document).width() / 8
    // if (size < 50) { size = 50 }
    // width = Ember.$(document).width() / width
    console.log(this.get('size'))
    this.$(`[ref=${this.get('counter')}]`).css("width", this.get('size'))
    this.$(`[ref=${this.get('counter')}]`).css("height", this.get('size'))
    this.set('value', this.get('matrix')[this.get('counter')].value)
    this.$(`[ref=${this.get('counter')}]`).addClass(`color-${this.get('value')}`)
  },
  actions: {
    push() {
      if (this.get('value') > 0) {
        this.sendAction('updateMatrix', this.get('counter'))
      }
    }
  }
});
