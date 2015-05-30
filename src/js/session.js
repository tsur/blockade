let session = new Object();

session.direction = 'right';
session.score = 0;
session.gameLoop = null;
session.snake = new Array();
session.width = null;
session.height = null;
session.cellSize = 10;
session.canvas = null;
session.canvasCtx = null;
session.bgColor = '#42C155';
session.snakeColor = '#3A3536';
session.scoreIncrement = 10;
session.speed = 80;

export
default session;