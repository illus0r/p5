function setup() {
	// bootstrapping
  capturer = new CCapture({format: 'webm'})
  capturer.start()
  createCanvas(512, 512);
  vienNumberLimit = 100
  // randomSeed(1)
  // frameRate(0.5)
  init()
}

function init() {
  tree = [new Vein(random(width), random(height))]
  ss = []
  for (i = 0; i < 4000; i++) {
    ss.push(new Source())
  }
  minDistance = 20
  step = 0
  k = 0.3
}

function draw() {
  background(0)
  // strokeWeight(3)
  // stroke('yellowgreen')
  ss.forEach(function(d) {
    d.affectNearestVein()
    // d.render()
  })
  strokeWeight(2)
  stroke('white')
  tree.forEach(function(d) {
    d.grow()
  })
  tree.forEach(function(d) {
    d.render()
  })
  if (tree.length > vienNumberLimit) {
    init()
  }
  step++
  capturer.capture(canvas);
}


function Source() {
  this.x = random(width)
  this.y = random(height)
  this.isActive = true

  this.affectNearestVein = function() {
    if (this.isActive) {
      // find nearest vein
      var nearestVeinDistance = 999999999
      var nearestVeinIndex = NaN
      var th = this
      tree.forEach(function(d, i) {
        distance = dist(d.x, d.y, th.x, th.y)
        // console.log(th.y)
        if (distance < nearestVeinDistance) {
          nearestVeinDistance = distance
          nearestVeinIndex = i
          // remove those who have vein too close
          if (distance < minDistance) {
            this.isActive = false
          }
        }
      })
      // print(nearestVeinIndex)
      var vein = tree[nearestVeinIndex]
      // push()
      // strokeWeight(0.1)
      // line(vein.x, vein.y, this.x, this.y)
      // pop()
      vein.applyForce(
        createVector(this.x - vein.x, this.y - vein.y).mult(k)
      )
    }
  }

  this.render = function() {
    if (this.isActive) {
      point(this.x, this.y)
    }
  }
}


function Vein(x, y, x_parent, y_parent, birthFrame) {
  this.x = x
  this.y = y
  this.x_parent = x_parent
  this.y_parent = y_parent
  this.birthFrame = birthFrame
  this.force = []

  this.applyForce = function(v) {
    this.force.push(v)
  }

  this.grow = function() {
    if (this.force.length > 0) {
      // find grow direction
      sumX = 0
      sumY = 0
      this.force.forEach(function(d) {
        sumX += d.x
        sumY += d.y
      })
      sumX /= this.force.length
      sumY /= this.force.length
      this.force = []
      // add descendant
      // print(tree)
      tree.push(new Vein(this.x + sumX,
        this.y + sumY,
        this.x,
        this.y,
        step))
      print('len', tree.length)
    }
  }
  this.render = function() {
    strokeWeight((step - birthFrame) / 1)
    line(this.x, this.y, this.x_parent, this.y_parent)
    // print(this.x, this.y)
  }
}

function keyPressed() {
  capturer.save()
  // init()
}
