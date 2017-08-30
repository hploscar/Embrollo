import Ember from 'ember';

export default Ember.Controller.extend({
  columns: 6,
  rows: 7,
  clicks: 12,
  message: "",
  matrix: function() {
    let columns = Math.floor(Ember.$('.matrix').width() / 54)
    // let c = Ember.$('.matrix').height() % 54
    // let rows = this.get('rows')
    let rows = Math.floor(Ember.$('.matrix').height() / 60)
    // let r = Ember.$('.matrix').height() % 54
    this.set('counterSize', Math.floor(Ember.$('.matrix').width() / columns))
    this.set('columns', columns)
    // this.set('rows', rows)
    // let matrix = Array(this.get('columns') * this.get('rows')).fill(0)
    // let matrix = Array(this.get('rows') + 1).fill([])
    let matrix = []
    for (let i = 0; i < rows; i++) {
      let row = []
      for (let j = 0; j<=columns; j++) {
        row.pushObject({value: Math.floor(Math.random()*3)})
      }
      matrix[i] = row
    }

    // for (const row of matrix) {
    //   row.pushObject({value: "AS"})
    //   // for (let j = 0; j <= columns; j++) {
    //     // matrix[i].pushObject(Ember.Object.create({ col: j, value: Math.floor(Math.random()*3)}))
    //     // row.pushObject(Ember.Object.create({value: Math.floor(Math.random()*3)}))
    //   // }
    // }

    return Array(this.get('columns') * this.get('rows')).fill(0).map(function() {
      return Ember.Object.create({value: Math.floor(Math.random()*3)})
    })
  }.property(),

  // init() {
  //   let width = Ember.$(document).width()
  //   let columns = 0
  //   this.set('counterSize', width / 20)
  //   this.set('width', this.get('counterSize') * 10)
  // //       size
  // //   // while (columns < 8 || columns > 8) {
  // //   //   size = 80
  // //   columns = width / size
  // //   //   size--
  // //   // }
  // },

  spreadTopTiles(matrix, i) {
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
