module.exports = {
    mode: 'development',
    entry: ['./src/loader.js', 
    './src/main.js',
    './src/audio.js',
    './src/canvas.js',
    './src/utils.js',],
    output: {
      filename: './bundle.js'
    }
  };