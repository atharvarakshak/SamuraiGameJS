class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } })     //velocity,color='red',offset
  {
    this.position = position    // position origin is top left corner

    this.width = 50
    this.height = 200
    this.image = new Image()   /// creates html image with javascript property
    this.image.src = imageSrc   // store image within property of the image
    this.scale = scale
    this.framesMax = framesMax
    this.frameCurrent = 0  // specifies no of frames to be mult to(width/ frames)
    this.framesElapsed = 0
    this.framesHold = 6
    this.offset = offset
  }
  draw() {
    c.drawImage(this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,   //for cropping image width/ no of frames * scale
      this.image.height * this.scale)

  }
  animateFrames() {
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold == 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++

      }
      else {
        this.frameCurrent = 0
      }
    }
  }
  update() {
    this.draw()  // drawing update images of sprites
    this.animateFrames()
  }
}
class Fighter extends Sprite  // we need to make available properties of Sprite class into fighter
//class so we need to inherit them

{
  constructor({ position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 200
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,   // also written as offset:offset

      height: attackBox.height,
      width: attackBox.width,
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.frameCurrent = 0  // specifies no of frames to be mult to(width/ frames)
    this.framesElapsed = 0
    this.framesHold = 6
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }

    //    console.log(this.sprites);

  }

  update() {
    this.draw()
    if (!this.dead)           // if player is dead then animate frame does not work
    { this.animateFrames() }
    //     attack box

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    //draw attack box
    //    c.fillRect(this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width,
    //     this.attackBox.height) 


    this.position.x += this.velocity.x
    this.position.y += this.velocity.y  // updates position corresponding to velocity

    // console.log('hii')
    // gravity funct enforces air to occur
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
      this.position.y = 280
    }
    else this.velocity.y += gravity   // as long as player is above the ground it will fall
    //    console.log(this.position.y) 
  }
  attack() {
    this.switchSprite('attack1')
    this.isAttacking = true
    //setTimeout(() =>
    //  {
    //      this.isAttacking = false
    //  },1000)
  }

  takeHit()   // decreases health call switch sprite
  {
    // this.switchSprite('takeHit')
    this.health -= 10
    if (this.health <= 0) {
      this.switchSprite('death')
    }
    else {
      this.switchSprite('takeHit')
    }
  }
  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.frameCurrent = 0
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.frameCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.frameCurrent = 0
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.frameCurrent = 0
        }
        break

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.frameCurrent = 0
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.frameCurrent = 0
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.frameCurrent = 0
        }
        break
    }
  }
}