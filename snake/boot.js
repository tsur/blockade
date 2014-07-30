require.config({
    
  paths: {

    'kinetic': '../vendors/kineticjs/kinetic.min',
    'preload': '../vendors/PreloadJS/lib/preloadjs-0.4.1.min',
  },

  shim: {},

  //allow cross-domain requests for text plugin as long as remote server allows CORS
  config: 
  {
      text: 
      {
        useXhr: function (url, protocol, hostname, port){return true;}
      }
  },

  deps: ['./js/app']
});

