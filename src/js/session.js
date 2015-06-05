let session = new Object();

session.snake = new Array();
session.snakeLength = 15;

session.gameLoop = null;

session.score = 0;
session.scoreIncrement = 10;

session.width = null;
session.height = null;
session.cellSize = 10;

session.direction = 'right';
session.speed = 80;
session.changeColorSpeed = 1500;

session.canvas = null;
session.canvasCtx = null;
session.snakeColor = '#42C155';
session.bgColor = '#3A3536';
session.bgRandomColors = ['#3A3536', 'transparent', '#7AA6E1', '#D64042', '#96BAD5', '#DADDC3', '#A26DA0', '#D50C14', '#FFD78E', '#F4DAF4', '#E7B646', '#979060', '#BF9F6D', '#FA04AF', '#BA6FB5', '#BA7AA6', '#778127', '#CFC5D7', '#458687', '#BCBDEB', '#DA5603', '#88E01B', '#FFB38A', '#D7179E', '#FC3A49']

export
default session;