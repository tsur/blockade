
jQuery(document).ready(function(){

  var stage = new Kinetic.Stage({
    container: 'game',
    width: window.innerWidth,
    height: window.innerHeight
  });

  var layers = {'bg':new Kinetic.Layer()};

  var bg_rect = new Kinetic.Rect({

    'width': stage.attrs.width,
    'height': stage.attrs.height,
    'fillLinearGradientStartPoint':{x:0,y:0},
    'fillLinearGradientEndPoint':{x:stage.attrs.width,y:stage.attrs.height},
    'fillLinearGradientColorStops':[0, '#D7D7E2', 1, '#B7CBCF']
  });

  // add the shape to the layer
  layers['bg'].add(bg_rect);

  stage.add(layers['bg']);

  var assets = [

    //Images
    {'id':'ebury_logo', 'src':'./snake/images/ebury_logo.png'},
    {'id':'snake_body', 'src':'./snake/images/dollar.png'},
    {'id':'snake_head', 'src':'./snake/images/snake_head.png'},
    {'id':'zuri_pic', 'src':'./snake/images/zuri_pic.png'},
    {'id':'food_pic', 'src':'./snake/images/food_pic.png'},
    {'id':'albert_pic', 'src':'./snake/images/albert_pic.png'},

    //Audios
    //{'id':'audio_main', 'src':'http://dl.dropbox.com/u/26141789/canvas/snake/main.ogg'},
    {'id':'audio_main', 'src':'./snake/sounds/main3.ogg'},
    {'id':'audio_gameover', 'src':'./snake/sounds/bacala.ogg'},
    {'id':'audio_food', 'src':'./snake/sounds/eating.ogg'},
    {'id':'audio_welcome', 'src':'./snake/sounds/welcome_ebury.ogg'},
    {'id':'zuri_sound', 'src':'./snake/sounds/nonono.ogg'},
    {'id':'albert_sound', 'src':'./snake/sounds/albert_sound.ogg'}

  ];

  var ENEMIES = [

    {'pic':'food_pic', 'sound':'audio_food'},
    {'pic':'albert_pic', 'sound':'audio_food'},
  ]

  var assets_queue = new createjs.LoadQueue(true);

  assets_queue.on("complete", main, this);
  // assets_queue.on("progress", loading, this);
  assets_queue.loadManifest(assets);

  function main(event)
  {
    $('#loading').remove();

    assets_queue.getResult('audio_welcome').play();

    var SIZE = 180;
    var time_update_game = 30;

    layers['loading'] = new Kinetic.Layer({x: (stage.getWidth()/2)-(320/2),
      y: (stage.getHeight()/2)-(285/2),
      width: 320,
      height: 285});

    layers['game'] = new Kinetic.Layer({x:0,y:0,width:SIZE*20, height:SIZE*10});

    var scaleX = window.innerWidth/layers['game'].getWidth();
    var scaleY = window.innerHeight/layers['game'].getHeight();

    //Haces un rectangulo sobre lo que quieras centrar y luego calculas:
    // x: (stage.getWidth()/2)-(rect.getWidth()/2)
    // y: (stage.getHeight()/2)-(rect.getHeight()/2)

    var circlesList = new CircleList();

    circlesList.circles = [
        // x, y, radius, color
        new Circle(150, 160, 90, "rgba(197, 171, 224,.9)"),
        new Circle(67, 136, 34,  "rgba(177, 190, 229,.9)"),
        new Circle(106, 74, 22,  "rgba(137, 150, 224,.8)"),
        new Circle(114, 52, 10,  "rgba(177, 125, 221,.75)"),
        new Circle(220, 82, 56,  "rgba(177, 165, 224,.6)"),
        new Circle(250, 138, 43, "rgba(157, 170, 223,.9)"),
        new Circle(232, 232, 25, "rgba(157, 181, 224,.9)"),
        new Circle(256, 222, 10, "rgba(107, 212, 225,.7)"),
        new Circle(128, 244, 36, "rgba(107, 190, 225,.9)"),
        new Circle(64, 188, 10,  "rgba(107, 205, 226,.9)")
    ];

    for(var i=0;i<circlesList['circles'].length;i++)
    {
      layers['loading'].add(circlesList['circles'][i].kcircle);
    }

    // variables accessible from within function(frame)
    var frameCount = 0;
    var currentSecond = 0;
    var frameRate = 0;
    
    var image = new Kinetic.Image({
      x: 100,
      y: 145,
      image: assets_queue.getResult('ebury_logo'),
      width: 113,
      height: 40,
      opacity: 1
    });

    layers['loading'].add(image);
    layers['loading'].draw();

    function updateFrameRate(time) {
          var second = Math.floor(time / 1000); // ms to integer seconds
          console.log(second, currentSecond)
          if (second != currentSecond) {
             frameRate = frameCount;
             frameCount = 0;
             currentSecond = second;
          }
          frameCount ++;
    }


    var anim = new Kinetic.Animation(function(frame) {

      // within function(frame), called with current time on each new frame
      
      //updateFrameRate(frame.time);

      wait(10, frame.time, function(){
          layers['loading'].getCanvas().getContext().globalCompositeOperation = 'darker';
          circlesList.update();
      });
      //console.log(frameRate);

      // layers['loading'].getCanvas().getContext().globalCompositeOperation = 'darker';
      // circlesList.update();

    }, layers['loading']);

    anim.start();

    stage.on('click.start touchstart.start', function(e){

        stage.off('click.start touchstart.start');
        anim.stop();

        var tween = new Kinetic.Tween({
            node: layers['loading'],
            opacity: 0,
            duration: 1,
            onFinish: function(){
                tween.destroy();
                layers['loading'].destroy();
                //Startgame
                // assets_queue.getResult('audio_main').addEventListener('ended', function(){

                //   console.log('ended');
                //   assets_queue.getResult('audio_main').pause();
                //   assets_queue.getResult('audio_main').play();

                // }, false);

                // assets_queue.getResult('audio_main').loop=true;
                // assets_queue.getResult('audio_main').play();
                initGame();
                startGame();
            }
        }).play();
    });

    stage.add(layers['loading']);
    // for(var layer in layers)
    // {
    //   stage.add(layers[layer]);
    // }

    function wait(seconds, time, callback) {
        seconds = seconds || 1000;
        var second = Math.floor(time / seconds);
        if (second != currentSecond) 
        {
           callback();
           currentSecond = second;
        }
    }

    var snake=new Player();
    var anim;
    var proccesing = false;

    function initGame()
    {
      
      layers['game'].scale({x:scaleX, y:scaleY});
      

      var canvas = layers['game'].getCanvas()._canvas;
      
      $(canvas).attr('tabindex', 1);

      $(canvas).keydown(function (data) {

        var key = data.keyCode;

        //SetTimeOut avoids cases as for instance going to left direction and pressing very quickly top and left, giving as a result a collision with the left part of the snake(basically going to the opposite way)

        if(!snake)
        {
          return;
        }

        //Going left
        if(key == 37 && snake.direction != 'right')
        {
          // snake.ndirection.push('left');
          snake.direction = 'left';
          //setTimeout(function(){snake.direction.push('left');}, 1);
        }
        //Going up
        else if(key == 38 && snake.direction != 'down')
        {
          // snake.ndirection.push('up');
          snake.direction = 'up';
          //setTimeout(function(){snake.direction.push('up');}, 1);
        }
        //Going right
        else if(key == 39 && snake.direction != 'left')
        {
          // snake.ndirection.push('right');
          snake.direction = 'right';
          //setTimeout(function(){snake.direction.push('right');}, 1);
        }
        //Going down
        else if(key == 40 && snake.direction != 'up')
        {
          // snake.ndirection.push('down');
          snake.direction = 'down';
          //setTimeout(function(){snake.direction.push('down');}, 1);
        }

      });

      anim = new Kinetic.Animation(function(frame) {

        //  wait(time_update_game, frame.time, function(){
            
        //     snake.update();
        // });

         snake.update();


      }, layers['game']);

      $(window).resize(function(e){

          scaleX = window.innerWidth/layers['game'].getWidth();
          scaleY = window.innerHeight/layers['game'].getHeight();
          layers['game'].scale({x:scaleX, y:scaleY});
          layers['game'].draw();

          stage.setWidth(window.innerWidth);
          stage.setHeight(window.innerHeight);

          bg_rect.size({width:window.innerWidth, height:window.innerHeight});
          bg_rect.fillLinearGradientEndPoint({x:window.innerWidth,y:window.innerHeight});
          layers['bg'].draw();

      });

      document.getElementById('retry').onclick = function(){
          startGame();
          return false;
      };

      stage.add(layers['game']);
    }

    function startGame()
    {
      document.getElementById('gameover').style.display='none';

      if(!snake)
      {
        snake = new Player();
      }
      // var border = new Kinetic.Rect({
      // width: layers['game'].getWidth(),
      // height: layers['game'].getHeight(),
      // stroke: 'black',
      // strokeWidth: 1, //Border Size in Pixels
      // fill: 'transparent' //Background Color
      // });
      // layers['game'].add(border);
      
      layers['game'].destroyChildren();
      layers['game'].add(snake.head);
      layers['game'].add(snake.food);

      // stage.on('mousemove.game', function(data){

      //     snake.targetPos.x = data.evt.clientX;
      //     snake.targetPos.y = data.evt.clientY;
      // });
      
      layers['game'].getCanvas()._canvas.focus();

      anim.start();
      
    }
    
    function Player()
    {
      this.direction = 'right';
      this.ndirection = null;
      this.sprint = SIZE;
      this.score = 0;
      this.running = true;
      this._speed = 1.4;
      this.speed = this._speed;
      this.enemy = ENEMIES[0]

      this.head = new Kinetic.Image({x: 0, y: 0, width: this.sprint, height: this.sprint, image:assets_queue.getResult('snake_head')});
      this.actor = [];
      this.food = new Kinetic.Image({x: layers['game'].getWidth()/2, y: layers['game'].getHeight()/2, width: this.sprint, height: this.sprint, image:assets_queue.getResult(this.enemy['pic'])});

      this.max_w = (layers['game'].getWidth() % 2 == 0 ? layers['game'].getWidth()-1: layers['game'].getWidth())/this.sprint;
      this.max_h=(layers['game'].getHeight() % 2 == 0 ? layers['game'].getHeight()-1: layers['game'].getHeight())/this.sprint;

      this.update = function()
      {
        
        if(!this.running)
        {
          return;
        }

        if(this.speed>0)
        {
          this.speed-=0.2;
          return
        }

        this.speed = this._speed;

        //Collipsion
        var x = x2 = this.head.x();
        var y = y2 = this.head.y();

        // if(this.ndirection.length)
        // {
        //   this.direction = this.ndirection.shift();
        // }

        if(this.direction == 'right')
        {
          
          x2 += (this.sprint);
          x = x2-(this.sprint);
        }
        else if(this.direction == 'left')
        {
          
          x2 -= (this.sprint);
          x = x2+(this.sprint);
        }
        else if(this.direction == 'up')
        {
          
          y2 -= (this.sprint);
          y = y2+(this.sprint);
        }
        else if(this.direction == 'down')
        {
          
          y2 += (this.sprint);
          y = y2-(this.sprint);
        }

        //Wall Collision
        if(x2 < 0 || x2>layers['game'].getWidth()-SIZE || y2 < 0 || y2>layers['game'].getHeight()-SIZE)
        {
          return this.game_over();
        }

        //Remove last element and return it
        if(this.actor.length)
        {
          
          //Snake collision
          for(var i=0; i<this.actor.length; i++)
          {
            if(x2==this.actor[i].x() && y2==this.actor[i].y())
            {
              return this.game_over();
            }
          }

          var tail = this.actor.pop();
          tail.x(x);
          tail.y(y);

          //Add to the begining
          this.actor.unshift(tail);
        }

        this.head.x(x2);
        this.head.y(y2);
        
        //Food collision
        if(x2==this.food.x() && y2==this.food.y())
        {

          //Music
          assets_queue.getResult(this.enemy['sound']).pause();
          assets_queue.getResult(this.enemy['sound']).currentTime = 0;
          assets_queue.getResult(this.enemy['sound']).play();

          if(this.enemy['pic']=='zuri_pic')
          {
            return;
          }

          var new_actor = new Kinetic.Image({x: x, y: y, width: this.sprint, height: this.sprint, image:assets_queue.getResult('snake_body')});

          this.actor.push(new_actor);

          layers['game'].add(new_actor);

          if(this._speed>0)
          {
            this._speed -=0.001
          }
          // if(time_update_game>5)
          //   time_update_game -= 0.5

          //Points
          this.score += 10;
          // scoreText.innerHTML = "Score: "+score;

          //Change food position

          var calculate_food_position = false;
          
          do
          {
            calculate_food_position = this.calculate_food_position();
          }
          while(!calculate_food_position);

          this.food.x(calculate_food_position.x);
          this.food.y(calculate_food_position.y);
          this.food.image(assets_queue.getResult(this.enemy['pic']));

          if(Math.random()>0.95)
          {
            this.enemy = {'pic':'zuri_pic', 'sound':'zuri_sound'};
            this.food.image(assets_queue.getResult(this.enemy['pic']));

            var that = this;

            setTimeout(function(){

              that.enemy = ENEMIES[0];

              that.food.x(0);
              that.food.y(0);
              that.food.image(assets_queue.getResult(that.enemy['pic']));

            }, 7000);
          }
          else
          {
            this.enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
          }

        }

      }

      this.calculate_food_position = function()
      {
         
          var x = SIZE*parseInt(Math.random()*this.max_w);
          var y = SIZE*parseInt(Math.random()*this.max_h);

          for(var i=0; i<this.actor.length; i++)
            {
              if(x==this.actor[i].x() && y==this.actor[i].y())
              {
                return false;
              }
            }

          return {x:x,y:y};
      }

      this.game_over = function()
      {
        this.running = false;
        
        anim.stop();
        assets_queue.getResult('audio_gameover').pause();
        assets_queue.getResult('audio_gameover').currentTime = 0;
        assets_queue.getResult('audio_gameover').play();
        document.getElementById('gameover').style.display='block';
        document.getElementById('score').innerHTML='SCORE: '+this.score;

        snake = null;
        // assets_queue.getResult('audio_main').pause();

      }

    };

    // data structures
    function CircleList()
    {
        this.circles = [];
        
        this.update = function()
        {
           // special case for first blob - which is the main magenta disc
           var circle = this.circles[0];
           if (Math.random() > 0.69)
           {
              circle.velocity.z += (Math.random()*0.10 - 0.05);
              circle.spring = 0.0125;
           }
           circle.update();
           
           // all the other blobs can animate based on mouse interaction
           for (var i = 1,dx,dy,d; i < this.circles.length; i++)
           {
              circle = this.circles[i];
              
              // else based on a random chance, pulse the blob
              if (Math.random() > 0.995)
              {
                 circle.targetPos[0] = circle.origin[0];
                 circle.targetPos[1] = circle.origin[1];
                 circle.velocity[2] += (Math.random()*0.30 - 0.15);
                 circle.spring = 0.0125;
              }
              // else just animate towards the original position
              else
              {
                 circle.targetPos[0] = circle.origin[0];
                 circle.targetPos[1] = circle.origin[1];
                 circle.spring = 0.05;
              }
              
              circle.update();
           }
        };
     };
     
     function Circle(x, y, radius, colour)
     {
        this.kcircle = new Kinetic.Circle({x:x, y:y, radius: radius, fill:colour, stroke: 'rgb(191, 191, 191)', strokeWidth: 1});
        this.origin = [x,y, 0];
        this.position = [x,y, 0];
        this.targetPos = [x,y, 0];
        this.originradius = radius;
        this.radius = radius;
        this.velocity = [0,0, 0];
        this.friction = 0.75;
        this.spring = 0.05;
        
        this.update = function()
        {
           this.velocity[0] += (this.targetPos[0] - this.kcircle.x()) * this.spring;
           this.velocity[0] *= this.friction;
           this.kcircle.x(this.kcircle.x() + this.velocity[0]);
           
           this.velocity[1] += (this.targetPos[1] - this.kcircle.y()) * this.spring;
           this.velocity[1] *= this.friction;
           this.kcircle.x(this.kcircle.x() + this.velocity[1]);
           
           var dox = this.origin[0] - this.kcircle.x(),
               doy = this.origin[1] - this.kcircle.y(),
               d = Math.sqrt(dox * dox + doy * doy);
           
           this.targetPos[2] = d/150 + 1;
           this.velocity[2] += (this.targetPos[2] - this.position[2]) * this.spring;
           this.velocity[2] *= this.friction;
           this.position[2] += this.velocity[2];
           
           this.kcircle.radius(this.originradius * this.position[2]);
           if (this.kcircle.radius() < 1) this.kcircle.radius(1);
        };
     };
  }
});


