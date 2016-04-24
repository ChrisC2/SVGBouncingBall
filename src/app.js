$(function(){
  //Box Properties
  var draw = SVG('box').viewbox(0, 0, 800, 600);
  var boundary = {width: draw.viewbox().width, height: draw.viewbox().height};

  //Animation ID
  var r_id = null;

  //Forces on Ball
  var gravity = .5;
  var bounceRatio = .7;
  var friction = .9;

  //Ball Properties
  var ball = draw.circle(50).attr({ fill: '#f39c12'}).style('cursor', 'pointer');
  var cx = ball.cx() //center x
  var cy = ball.cy(); //center y
  var vel = {x: 10, y: 5}; //directional velocity properties
  var radius = ball.attr('r');
  var speedRatio = 1;

  //Ball Position
  var oldPos = {x: 25, y: 25}; //old position
  var currPos= {x: 25, y: 25}; //current position

  //App States
  var dragging = false;
  var paused = false;

  //Initialize draggable Circle SVG
  ball.draggable();

  //Add listener for when drag starts
  ball.on('dragstart', function() {
    dragging = true;
    cancelAnimationFrame(r_id);
    r_id = null;
  }, false);

  //Add listener for when drag ends
  ball.on('dragend', function() {
    dragging = false;
    moveBall();
  }, false);

  //Add listener during drag
  ball.on('dragmove', function() {
    oldPos.x = currPos.x;
    oldPos.y = currPos.y;
    currPos.x = this.attr('cx');
    currPos.y = this.attr('cy');
    vel.x = (currPos.x - oldPos.x) * speedRatio;
    vel.y = (currPos.y - oldPos.y) * speedRatio;
  }, false)

  //Keeps Ball in Bounds
  var checkBounds = function() {
    //right boundary
    if(currPos.x + radius > boundary.width) {
      currPos.x = boundary.width - radius;
      vel.x *= -bounceRatio;
    };
    // left boundary
    if(currPos.x - radius < 0) {
      currPos.x = 0 + radius;
      vel.x *= -bounceRatio;
    };
    // bottom boundary
    if(currPos.y + radius > boundary.height) {
      currPos.y = boundary.height - radius;
      vel.y *= -bounceRatio;
      vel.x *= friction;
    };
    //top boundry
    if(currPos.y - radius < 0) {
      currPos.y = 0 + radius;
      vel.y *= -bounceRatio;
    };
  };

  //Update Ball Position
  var updatePosition = function(x,y) {
    ball.cx(x);
    ball.cy(y);
  };

  //Moves Ball
  var moveBall = function() {
    if(!dragging) {
      vel.y += gravity;
      currPos.x += vel.x;
      currPos.y += vel.y;
      //keep in bounds
      checkBounds();
      // update position of the ball
      updatePosition(currPos.x, currPos.y);

      r_id = requestAnimationFrame(moveBall);
    };
  };

  //Initialize Ball Animation
  r_id = requestAnimationFrame(moveBall);

  //Save Settings
  var saveSettings = function(size, speed, g, f, b) {
    ball = ball.radius(size);
    radius = ball.attr('r');
    speedRatio = speed;
    gravity = g;
    friction = f;
    bounceRatio = b;
  }

  //(Returns Boolean) Validate That Settings are Numbers
  var validateSettings = function() {
    var validate = {
      size: Number($('#ball-size').val()) / 2,
      speed: Number($('#ball-speed').val()),
      grav: Number($('#gravity').val()),
      fric: Number($('#friction').val()),
      rebound: Number($('#bounce').val())
    };
    for(var setting in validate) {
      if(isNaN(validate[setting]) === true) {
        return false;
      }
    }
    //Save Settings
    saveSettings(validate.size, validate.speed, validate.grav, validate.fric, validate.rebound);
    return true;
  };

  //Reset to Initial State
  var reset = function() {
    if(paused){
      paused = false;
      r_id = requestAnimationFrame(moveBall);
    };
    $('form')[0].reset();
    validateSettings();
    vel = {x: 10, y: 5};
    oldPos = {x: 25, y: 25};
    currPos= {x: 25, y: 25};
  };

  //Save Button Click
  $('#save').on('click', function(e) {
    var validated = validateSettings();
    if(validated){
      //Fade In Saved Message
      $('#save-message')
      .text('Settings Saved!')
      .css('color', '#439a46')
      .animate({
        opacity: 1
      }, 1000);
      //Fade Out
      $('#save-message')
      .delay(2000)
      .animate({
        opacity: 0
      }, 1000);
    } else {
      //Fade In Error Message
      $('#save-message')
        .text('Not Saved. You Must Enter Numbers')
        .css('color', 'tomato')
        .animate({
          opacity: 1
        }, 1000);
      //Fade Out
      $('#save-message').delay(2000).animate({
        opacity: 0
      }, 1000)
    }
    e.preventDefault();
  });

  //Pause Button Click
  $('#pause').on('click', function() {
    paused = true;
    cancelAnimationFrame(r_id);
    r_id = null;
  });

  //Resume Button Click
  $('#resume').on('click', function() {
    r_id = requestAnimationFrame(moveBall);
  });

  //Reset Button Click
  $('#reset').on('click', reset);

});
