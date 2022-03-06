const heart = new Image();
heart.src = "resources/images/heart.png";
const cupcake = new Image();
cupcake.src = "resources/images/cupcake.png";
const flower2 = new Image();
flower2.src = "resources/images/flower.png";
const shoe = new Image();
shoe.src = "resources/images/shoe.png";
const latter = new Image();
latter.src = "resources/images/latter.png";
const main_bg = new Image();
main_bg.src = "resources/images/main_bg.png";
const tutorial_bg = new Image();
tutorial_bg.src = "resources/images/tutorial_bg.png";
const sockl = new Image();
sockl.src = "resources/images/iconl.png";
const sockr = new Image();
sockr.src = "resources/images/iconr.png";
const over = new Image();
over.src = "resources/images/over.png";
const share = new Image();
share.src = "resources/images/share.png";

let money = 0;
let timeout = 30;
let sockCost = 10;
let flowerCost = 100;
let cost = "50";
let etap = 0;


function explosion(x, y) {
  let i = 0;
  objects.forEach((object) => {
    if(object.constructor.name === "Product") {
      i += 1;
      if(object.effect != explosion) { object.effect(); objects.push(new FlyText(object.text, i * 75, object.color)); }
      else i -= 1;
      object.destroyed = true;
    }
  });
}
function timeoutDown() { if(timeout != 0) timeout -= 2; }
function sock() { money += sockCost; }
function flower() { money += flowerCost; }
function multiplierUp() {
  sockCost *= 1.2;
  sockCost = float2int(sockCost);
  flowerCost *= 1.2;
  flowerCost = float2int(flowerCost);
}

async function fitstHeart() {
  money += sockCost;

  objects.forEach((object) => { if(object.constructor.name != "Mouse") object.destroyed = true; });

  objects.push(new Background(main_bg));
  objects.push(new Getter(216/2, 216/2, heart));
  objects.push(new Generator());
  objects.push(new GetterSpawner());
  objects.push(new Sock(900, 879));
}

function gameOver() {
  objects.forEach((object) => { if(object.constructor.name != "Mouse") object.destroyed = true; });
  objects.push(new Background(over));
  objects.push(new Sock(200, 1080-100));
  objects.push(new Share());
}


class Sock extends Button {
  constructor(x, y) {
    super(x, y, 300, 200);
    this.image = sockl;
  }

  onPress() {
    this.image = this.image === sockl ? sockr : sockl;
  }

  render() {
    renderImage(this.image, this.transform);
  }
}


class Product extends Button {
  constructor(x, y, image, text, color, effect) {
    super(x, y, 200, 200);
    this.startPoint = new Vector2(0, 0);
    this.image = image;
    this.effect = effect;
    this.text = text;
    this.color = color;
    this.tick = 0;
  }
  update() {
    this.isStartPoint = true;
    super.update();
    if(this.pressed === true) {
      this.transform.position.x = mouse.transform.position.x + this.startPoint.x;
      this.transform.position.y = mouse.transform.position.y + this.startPoint.y;
    }
    this.tick += 1;
    if(this.tick >= 1000) this.destroyed = true;
  }

  onPress() {
    this.startPoint.x = this.transform.position.x - mouse.transform.position.x;
    this.startPoint.y = this.transform.position.y - mouse.transform.position.y;
    this.animation(-20);
  }

  onRelease() { this.animation(20); }
  onInterrupt() { this.animation(20); }

  animation(value){
    this.transform.size.x += value;
    this.transform.size.y += value;
  }

  render() { context.globalAlpha = (1000 - this.tick) / 1000; renderImage(this.image, this.transform); context.globalAlpha = 1; }
}

class Background extends GameObject {
  constructor(image) { super(540, 540, 1080, 1080); this.image = image; }
  render() { renderImage(this.image, this.transform); }
}

class Getter extends GameObject {
  constructor(x, y, image) { super(x, y, 216, 216); this.image = image; }
  update(){
    if(!this.collide) this.isStart = true;
    this.collide = false;
  }
  collision(other) {
    if(other.constructor.name === "Product" && other.image === this.image && other.destroyed === false)
    {
      if(other.effect) other.effect();
      objects.push(new FlyText(other.text, 0, other.color));
      other.destroyed = true;
    }
  }
  render() { renderImage(this.image, this.transform); }
}

class Generator extends GameObject {
  constructor() {
    super(0, 0, 0, 0);
    this.tick = 0;
  }
  update() {
    this.tick += 1;
    if(this.tick >= timeout) {
      createProduct();
      this.tick = 0;
    }
  }
  render() {
    context.font = "100px cursive";
    context.fillStyle = "black";
    context.fillText(money + "/" + cost, 5, 1070);
  }
}

class FlyText extends GameObject {
  constructor(text, y, color) {
    super(5, 995 - y, 0, 0)
    this.speed = 2;
    this.text = text;
    this.tick = 0;
    this.timeout = 100;
    this.color = color;
  }

  update() {
    this.transform.position.y -= this.speed;
    // this.transform.position.x += 1;
    this.tick += 1;
    if(this.tick === this.timeout) this.destroyed = true;
  }

  render() {
    context.globalAlpha = (100 - this.tick) / 100;
    context.font = 70 + "px cursive";
    context.fillStyle = this.color;
    context.fillText(this.text, this.transform.position.x, this.transform.position.y);
    context.globalAlpha = 1;
  }
}


function createProduct() {
  const randX = 100 + float2int(random() * 880);
  const randY = 320 + float2int(random() * 550);
  const randType = float2int(random() * 100);
  if(randType <= 50 && etap >= 0) objects.push(new Product(randX, randY, heart, `+${sockCost}`, "blue", sock));
  else if(randType <= 70 && etap >= 1) objects.push(new Product(randX, randY, flower2, `+${flowerCost}`, "pink", flower));
  else if(randType <= 80 && etap >= 2) objects.push(new Product(randX, randY, latter, "всё дороже на 20%", "yellow", multiplierUp));
  else if(randType <= 90 && etap >= 3) objects.push(new Product(randX, randY, shoe, "ускорение", "green", timeoutDown));
  else if(randType <= 100 && etap >= 4) objects.push(new Product(randX, randY, cupcake, "взрыв", "orange", explosion));
}

class GetterSpawner extends GameObject {
  constructor() {
    super(0, 0, 0, 0)
  }
  update() {
    if(etap === 0 && money >= 50) { cost = 300; objects.push(new Getter(216 * 1.5, 216/2, flower2)); etap += 1; }
    else if(etap === 1 && money >= 300) { cost = 700; objects.push(new Getter(216 * 2.5, 216/2, latter)); etap += 1; }
    else if(etap === 2 && money >= 700) { cost = 1200; objects.push(new Getter(216 * 3.5, 216/2, shoe)); etap += 1; }
    else if(etap === 3 && money >= 1200) { cost = 1500; objects.push(new Getter(216 * 4.5, 216/2, cupcake)); etap += 1; }
    else if(etap === 4 && money >= 1500) { etap += 1; gameOver(); }
  }
}

class Share extends Button {
  constructor() { super(725, 1080-150, 455*1.5, 100*1.5); }
  render() { renderImage(share, this.transform); }
  onInterrupt(){
    this.transform.size.x *= 1.1;
    this.transform.size.y *= 1.1;
  }
  onRelease(){
    this.transform.size.x *= 1.1;
    this.transform.size.y *= 1.1;
    if (navigator.share) {
      navigator.share({
        text: 'С 8 марта!!!',
        url: 'https://kholodovilya.github.io/hello/'
      }).then(() => {  }).catch((err) => alert("Произошла ошибка"));
    } else { alert("Извините, ваш браузер не может поделиться ссылкой!"); }
  }
  onPress() {
    this.transform.size.x /= 1.1;
    this.transform.size.y /= 1.1;
  }
}

objects.push(new Background(tutorial_bg));
objects.push(new Product(540, 540, heart, `+${sockCost}`, "blue", fitstHeart));
objects.push(new Getter(216/2, 216/2, heart));
