import Ember from 'ember';

export default Ember.Controller.extend({
  clicks: 12,
  message: "",
  matrix: function() {
    return Array(100).fill(0).map(function() {
      return Ember.Object.create({value: Math.floor(Math.random()*3)})
    })
  }.property(),

  matrixObserver: Ember.observer('matrix', (data) => {
    // console.log("Matrix Change in Controller")
  }),

  spreadTopTiles(matrix, i) {
    let self = this
    Ember.run.later((function() {
      console.log(matrix[i].value)
      console.log(i)
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
        self.spreadTopTiles(matrix, i - 10)
      }
    }), 500)

  },
  spreadDownTiles(matrix, i) {
    let self = this
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
        self.spreadDownTiles(matrix, i + 10)
      }
    }), 500)
  },

  spreadRigthTiles(matrix, i) {
    let self = this
    if(!String(i).match(/9/g)) {
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
          self.spreadRigthTiles(matrix, i + 1)
        }
      }), 500)
    }
  },
  spreadLeftTiles(matrix, i) {
    let self = this
    if(!String(i).match(/0/g)) {
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
          self.spreadLeftTiles(matrix, i - 1)
        }
      }), 500)
    }
  },
  spreadVertical(matrix, index) {
    if (index > 9)  { this.spreadTopTiles(matrix, index)  }
    if (index < 90) { this.spreadDownTiles(matrix, index) }
  },

  spreadHorizontal(matrix, index) {
    if (index >= 0 && index <= 99) {
      this.spreadRigthTiles(matrix, index)
      this.spreadLeftTiles(matrix, index)
    }
  },

  actions: {
    boom(index){
      let self    = this,
          matrix  = this.get('matrix')

      if (this.get('clicks') < 12) { this.set('clicks', this.get('clicks') + 1)}

      matrix[index] = Ember.Object.create({ value: 0 })
      this.set('matrix', matrix)

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
