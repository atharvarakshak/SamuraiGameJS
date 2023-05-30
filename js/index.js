//Basic fighting mechanism *
//1 Create player and enemy *
//2 Move charcteristic with event listner * 
//3 attacks 
//4 Health bar interface
//game timers and game overs



const canvas=document.querySelector("canvas"); //select an element 
const c=canvas.getContext('2d') // context c is created 

canvas.width=1024; // declaring canvas elements
canvas.height=576;
 c.fillRect(0,0,canvas.width,canvas.height) //method to create a  canvas,enemy,player

 const gravity=0.7

 const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
 })
 const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6          /// setting maximum frames 

 })
 const player=new Fighter({
    position:{
    x:0,
    y:0
    } ,
    velocity:{
      x:0,
      y:0
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset :{
        x: 215,
        y: 105
    },
    sprites: {
        idle: {
            imageSrc:'./img/samuraiMack/Idle.png',
            framesMax: 8
        
        },
        run: {
            imageSrc:'./img/samuraiMack/Run.png',
            framesMax: 8
            // image: new Image()
        },
        jump: {
            imageSrc:'./img/samuraiMack/Jump.png',
            framesMax: 2,
            // image: new Image()
        },
        fall:{
            imageSrc:'./img/samuraiMack/Fall.png',
            framesMax: 2,
            // image: new Image()

        },
        attack1:{
            imageSrc:'./img/samuraiMack/Attack1.png',
            framesMax: 6,
            // image: new Image()
        },
        attack2:{
            imageSrc:'./img/samuraiMack/Attack2.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
            // image: new Image()
        },
        death:{
            imageSrc:'./img/samuraiMack/Death.png',
            framesMax: 6,
            // image: new Image()
        }
        
    },
    attackBox:{
        offset:{
            x:100,
            y:90
        },
        width : 160,
        height: 50
        
    }
    
})

//  player.draw()  // only called when file is first updated

 const enemy=new Fighter({
    position:
    { x:400, y:100 } ,  
    velocity:{
      x:0,
      y:0
    },
    color: 'blue',
    offset:{
        x:-50,
        y:0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset :{
        x: 215,
        y: 120
    },
    sprites: {
        idle: {
            imageSrc:'./img/kenji/Idle.png',
            framesMax: 4
        
        },
        run: {
            imageSrc:'./img/kenji/Run.png',
            framesMax: 3,
            // image: new Image()
        },
        jump: {
            imageSrc:'./img/kenji/Jump.png',
            framesMax: 2,
            // image: new Image()
        },
        fall:{
            imageSrc:'./img/kenji/Fall.png',
            framesMax: 2,
            // image: new Image()

        },
        attack1:{
            imageSrc:'./img/kenji/Attack1.png',
            framesMax: 4,
            // image: new Image()
        },
        attack2:{
            imageSrc:'./img/kenji/Attack2.png',
            frameMax: 4
        },
        takeHit:{
            imageSrc:'./img/kenji/Take hit.png',
            frameMax:3,
            // image: new Image()
        },
        death:{
            imageSrc:'./img/kenji/Death.png',
            framesMax: 7
            // image: new Image()
        }

    },
    attackBox:{
        offset:{
            x:-180,
            y:90
        },
        width : 180,
        height: 50
        
    }

    
})
//  enemy.draw()

//console.log(player)

const keys={            // we specify  separate key variables to run the game smoothly
    a:{
        pressed: false        // we define objects for our keys to be accesed
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }

}

 decreaseTimer()

function animate()
{
    window.requestAnimationFrame(animate)// creates infinite loop around animate function
    // console.log("hello")

    c.fillStyle="black"

    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle='rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update(); 
    enemy.update()
   
    // player movement loop
    player.velocity.x=0
    // player.switchSprite('idle')
  
    if(keys.a.pressed && player.lastKey == "a")
    {
       player.velocity.x = -5
       player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey == "d")
    {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }
    // enemy jumping
    if( player.velocity.y < 0)
    { 
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0)
    {
        player.switchSprite('fall')
    }

    enemy.velocity.x=0
    // enemy movement loop
      // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

    // enemy jumping
    if( enemy.velocity.y < 0)
    { 
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall')
    }
    

    // detect for collision & hit OF PLAYER
    if(rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    })&&
        player.isAttacking &&
         player.frameCurrent == 4 )
    {
        enemy.takeHit()
        player.isAttacking = false
        // console.log("succes")
         //player.health -= 20 
        //document.querySelector('#playerHealth').style.width=player.health+'%'
        gsap.to('#enemyHealth',{width: enemy.health + '%'})
    }
    // if enemy misses
    if(player.isAttacking && player.frameCurrent == 4)
    {
       player.isAttacking = false
    }
      
  // enemy attack
    if(rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    })&&
        enemy.isAttacking &&
         enemy.frameCurrent == 2 )
    {
        player.takeHit()
        enemy.isAttacking = false
        // console.log("succes")
         //player.health -= 20 
        //document.querySelector('#playerHealth').style.width=player.health+'%'
        gsap.to('#playerHealth',{width: player.health + '%'})
    }
    // if enemy misses
    if(enemy.isAttacking && enemy.frameCurrent == 2)
    {
       enemy.isAttacking = false
    }

    //end game based on health
    if(enemy.health <=0 || player.health<=0)
    {
        determineWinner({player,enemy,timerId})
      
    }
}
animate()
window.addEventListener('keydown', (event)=>{ 
    //console.log(event.key); 
    if(!player.dead)
    {
      // ading event listner for event when key is pressed
    switch(event.key)
    { // player movement ******
        case 'd':
            keys.d.pressed = true  
            player.lastKey='d'
            // player.velocity.x=1
        break;
        case 'a':
            keys.a.pressed = true
            player.lastKey='a'                       // d.press and a.press is true at same time
            // player.velocity.x=-1
        break;
        case 'w':
             keys.w.pressed = true
            // lastKey='w'                       
            player.velocity.y=-20
        break;
        // attacking with space bar
        case ' ':
            player.attack()
        break;
        
    }
 } 

    switch(event.key)
    {
        // for enemy movement ******
        case 'ArrowRight':
            keys.ArrowRight.pressed = true  
            enemy.lastKey = 'ArrowRight'
            
            // player.velocity.x=1
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'        
            // player.velocity.x=-1
        break;
        case 'ArrowUp':
            // keys.w.pressed = true
            // lastKey='w'                       
            enemy.velocity.y=-20
        break;
        case 'ArrowDown':
            // keys.w.pressed = true
            // lastKey='w'                       
            enemy.attack()

        break;
    }
    //console.log(event.key);
})
window.addEventListener('keyup', (event)=>{    // ading event listner for event when key is lifted up
    switch(event.key)
    {
        case 'd':
            keys.d.pressed = false
            // player.velocity.x=0;
        break;
        case 'a':
            keys.a.pressed = false
            // player.velocity.x=0;
        break;
     }
     // enemy ****
     switch(event.key)
     {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            // player.velocity.x=0;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            // player.velocity.x=0;
        break;
     }
    console.log(event.key);
})