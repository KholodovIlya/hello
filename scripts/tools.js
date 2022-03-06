// Maths
function abs(value) { return value > 0 ? value : -value; }

let seed = (new Date()).getMilliseconds();
function random() { return ((seed = (71 * seed + 1) % 100000) / 100000); }

function float2int (value) { return value | 0; }
// Maths


// Render
function renderImage(image, transform) {
  context.drawImage(image,
    transform.position.x - transform.size.x / 2,
    transform.position.y - transform.size.y / 2,
    transform.size.x,
    transform.size.y);
}

function renderCollision(transform) {
  context.strokeStyle = "lime"; context.lineWidth = 1;
  context.strokeRect(
    transform.position.x - transform.size.x / 2, transform.position.y - transform.size.y / 2,
    transform.size.x, transform.size.y);
}
// Render


// Input
class Mouse extends GameObject { constructor() { super(0, 0, 1, 1); this.down = false; } collision(other) {} }
const mouse = new Mouse(); objects.push(mouse);

// PC input
document.addEventListener('mousemove', function(event) {
  mouse.transform.position.x = (event.clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
  mouse.transform.position.y = (event.clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
});
document.addEventListener('mousedown', function(event) { mouse.down = true; });
document.addEventListener('mouseup', function(event) { mouse.down = false; });
// PC input

// Mobile input
function touch(event) {
  if (event.touches.length > 0) {
    mouse.transform.position.x = (event.touches[event.touches.length - 1].clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
    mouse.transform.position.y = (event.touches[event.touches.length - 1].clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
  }
}
document.addEventListener('touchmove', function(event) { touch(event); });
document.addEventListener('touchstart', function(event) { touch(event); mouse.down = true; });
document.addEventListener('touchend', function(event) { touch(event); mouse.down = false; });
// Mobile input
// Input


// UI
class Button extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.isStartPoint = false;
    this.pressed = false;
    this.collide = false;
  }
  update() {
    if(!mouse.down) this.isStartPoint = true;
    else if(!this.collide) this.isStartPoint = false;
    if(this.pressed) {
      if(!mouse.down) {
        this.pressed = false;
        if (this.onRelease) this.onRelease();
      }
      if(!this.collide) {
        this.pressed = false;
        if (this.onInterrupt) this.onInterrupt();
      }
    }
    this.collide = false;
  }
  collision(other) {
    if(other.constructor.name === "Mouse") {
      this.collide = true;
      if(mouse.down & !this.pressed & this.isStartPoint) {
        this.pressed = true; if (this.onPress) this.onPress();
      }
    }
  }
}
// UI
