
jQuery(document).ready(function(){

  var stage = new Kinetic.Stage({
    container: 'game',
    width: window.innerWidth,
    height: window.innerHeight
  });

  var layers = {'sky':new Kinetic.Layer()};

  var rect = new Kinetic.Rect({

    'width': stage.attrs.width,
    'height': stage.attrs.height,
    'fillLinearGradientStartPoint':{x:0,y:0},
    'fillLinearGradientEndPoint':{x:stage.attrs.width,y:stage.attrs.height},
    'fillLinearGradientColorStops':[0, '#D7D7E2', 1, '#B7CBCF']
  });

  // add the shape to the layer
  layers['sky'].add(rect);

  for(var layer in layers)
  {
    stage.add(layers[layer]);
  }

});


