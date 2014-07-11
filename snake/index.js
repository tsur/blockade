
jQuery(document).ready(function(){

  var stage = new Kinetic.Stage({
    container: 'game',
    width: window.innerWidth,
    height: window.innerHeight
  });

  var layers = {'bg':new Kinetic.Layer(), 'loading':new Kinetic.Layer({x: (stage.getWidth()/2)-(320/2),
    y: (stage.getHeight()/2)-(285/2),
    width: 320,
    height: 285})};

  //Haces un rectangulo sobre lo que quieras centrar y luego calculas:
  // x: (stage.getWidth()/2)-(rect.getWidth()/2)
  // y: (stage.getHeight()/2)-(rect.getHeight()/2)

  var rect = new Kinetic.Rect({

    'width': stage.attrs.width,
    'height': stage.attrs.height,
    'fillLinearGradientStartPoint':{x:0,y:0},
    'fillLinearGradientEndPoint':{x:stage.attrs.width,y:stage.attrs.height},
    'fillLinearGradientColorStops':[0, '#D7D7E2', 1, '#B7CBCF']
  });

  // add the shape to the layer
  layers['bg'].add(rect);

  var circles  = [
      new Kinetic.Circle({x:150, y:160, radius: 90, fill:"rgba(197, 171, 224,.9)"}),
      new Kinetic.Circle({x:67,  y:136, radius:34, fill:"rgba(177, 190, 229,.9)"}),
      new Kinetic.Circle({x:106, y:74,  radius:22, fill:"rgba(137, 150, 224,.8)"}),
      new Kinetic.Circle({x:114, y:52,  radius:10, fill:"rgba(177, 125, 221,.75)"}),
      new Kinetic.Circle({x:220, y:82,  radius:56, fill:"rgba(177, 165, 224,.6)"}),
      new Kinetic.Circle({x:250, y:138, radius:43, fill:"rgba(157, 170, 223,.9)"}),
      new Kinetic.Circle({x:232, y:232, radius:25, fill:"rgba(157, 181, 224,.9)"}),
      new Kinetic.Circle({x:256, y:222, radius:10, fill:"rgba(107, 212, 225,.7)"}),
      new Kinetic.Circle({x:128, y:244, radius:36, fill:"rgba(107, 190, 225,.9)"}),
      new Kinetic.Circle({x:64,  y:188, radius:10, fill:"rgba(107, 205, 226,.9)"})
  ];

  for(var i=0;i<circles.length;i++)
  {
    layers['loading'].add(circles[i]);
  }

  var ebury_logo = new Image();

  ebury_logo.onload = function() {
    
    var image = new Kinetic.Image({
      x: 100,
      y: 145,
      image: ebury_logo,
      width: 113,
      height: 40,
      opacity: 1
    });

    layers['loading'].add(image);
    layers['loading'].draw();

  };   

  ebury_logo.src = './snake/images/ebury_logo.png';

  for(var layer in layers)
  {
    stage.add(layers[layer]);
  }



});


