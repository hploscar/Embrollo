import Ember from 'ember';

export default Ember.Controller.extend({
  columns: 8,
  rows: 10,
  clicks: 17,
  message: "",
  matrix: function() {
    let matrix = []

    for (let i = 0; i < this.get('rows'); i++) {
      let row = []
      for (let j = 0; j<=this.get('columns'); j++) {
        row.pushObject({value: Math.floor(Math.random()*3)})
      }
      matrix[i] = row
    }

    return Array(this.get('columns') * this.get('rows')).fill(0).map(function() {
      return Ember.Object.create({value: Math.floor(Math.random()*3)})
    })
  }.property(),

  spreadTopTiles(matrix, i) {
    let self = this
    if(i>0) {
      Ember.run.later((function() {
        if (matrix[i].value > 0) {
          matrix[i] = Ember.Object.create({value: matrix[i].value + 1})
          self.set('matrix', matrix)
          self.notifyPropertyChange('matrix')
        } else {
          Ember.$(`[ref=${i}]`).removeClass("animated flipInX")
          let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          Ember.$(`[ref=${i}]`).addClass("animated rubberBand").one(animationEnd, function() {
            Ember.$(`[ref=${i}]`).removeClass('animated rubberBand')
          })
          self.spreadTopTiles(matrix, i - self.get('columns'))
        }
      }), 500)
    }
  },

  spreadDownTiles(matrix, i) {
    let self = this

    if (i<80) {
      Ember.run.later((function() {
        if (matrix[i].value > 0) {
          matrix[i] = Ember.Object.create({value: matrix[i].value + 1})
          self.set('matrix', matrix)
          self.notifyPropertyChange('matrix')
        } else {
          Ember.$(`[ref=${i}]`).removeClass("animated flipInX")
          // Ember.$(`[ref=${i}]`).removeClass("rubberBand")
          let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          Ember.$(`[ref=${i}]`).addClass("animated rubberBand").one(animationEnd, function() {
              Ember.$(`[ref=${i}]`).removeClass('animated rubberBand')
          })
          self.spreadDownTiles(matrix, i + self.get('columns'))
        }
      }), 500)
    }
  },

  spreadRigthTiles(matrix, i) {
    let self = this
    let row = parseInt(i/this.get('columns'))

      Ember.run.later((function() {
        if (matrix[i].value > 0) {
          matrix[i] = Ember.Object.create({value: matrix[i].value + 1})
          self.set('matrix', matrix)
          self.notifyPropertyChange('matrix')
        } else {
          Ember.$(`[ref=${i}]`).removeClass("animated flipInX")
          let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          Ember.$(`[ref=${i}]`).addClass("animated rubberBand").one(animationEnd, function() {
              Ember.$(`[ref=${i}]`).removeClass('animated rubberBand')
          })
          if(self.get('columns')*(row+1)-1 != i) {
            self.spreadRigthTiles(matrix, i + 1)
          }
        }
      }), 500)
  },

  spreadLeftTiles(matrix, i) {
    let self = this
    let row = parseInt(i/this.get('columns'))
    // console.log(i);
    // if(this.get('columns')*row != i) {
      Ember.run.later((function() {
        if (matrix[i].value > 0) {
          matrix[i] = Ember.Object.create({value: matrix[i].value + 1})
          self.set('matrix', matrix)
          self.notifyPropertyChange('matrix')
        } else {
          Ember.$(`[ref=${i}]`).removeClass("animated flipInX")
          // Ember.$(`[ref=${i}]`).removeClass("rubberBand")
          let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          Ember.$(`[ref=${i}]`).addClass("animated rubberBand").one(animationEnd, function() {
              Ember.$(`[ref=${i}]`).removeClass('animated rubberBand')
          })

          if(self.get('columns')*row != i) {
            self.spreadLeftTiles(matrix, i - 1)
          }
        }
      }), 500)
    // }
  },

  spreadVertical(matrix, index) {
    if (index > this.get('rows') - 1)  { this.spreadTopTiles(matrix, index)  }
    if (index < this.get('columns')*this.get('rows') - this.get('columns')) { this.spreadDownTiles(matrix, index) }
  },

  spreadHorizontal(matrix, index) {
    let row = parseInt(index/this.get('columns'))
    if (index != row * this.get('columns')) {
      this.spreadLeftTiles(matrix, index)
    }
    // 0 && index <= this.get('columns')*this.get('rows') - 1) {
    if(this.get('columns')*(row+1)-1 != index) {
      this.spreadRigthTiles(matrix, index)
    }
  },

  actions: {
    boom(index){
      let self    = this,
          matrix  = this.get('matrix')

      if (this.get('clicks') < 17) { this.set('clicks', this.get('clicks') + 1)}

      matrix[index] = Ember.Object.create({ value: 0 })
      this.set('matrix', matrix)

      this.notifyPropertyChange('matrix')

      self.spreadVertical(matrix, index)
      self.spreadHorizontal(matrix, index)
    },

    updateMatrix(index) {
      if (this.get('clicks') > 0) {
        this.set('clicks', this.get('clicks') - 1)

        let matrix = this.get('matrix')
        let value = matrix[index].value

        if (value >= 4) {
          this.send('boom', index)
        } else {
          matrix[index] = Ember.Object.create({ value: value + 1 })
        }

        this.set('matrix', matrix)
        this.notifyPropertyChange('matrix')

      } else {
        this.set('message', "You lose !")
      }
    }
  }
});
