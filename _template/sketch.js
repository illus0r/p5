function setup() {
	// bootstrapping
  capturer = new CCapture({format: 'webm'})
  capturer.start()
  createCanvas(512, 512);
  init()
}

// set up variables for quick reseting processing
function init() {
}

function draw() {
	 capturer.capture(canvas);
}


function keyPressed() {
	print(keyCode)
	// press `S` to save the movie
	if(keyCode === 83){
		capturer.save()
	}
