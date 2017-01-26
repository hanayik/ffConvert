const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const execSync = require( 'child_process' ).execSync
let appRootDir = require('app-root-dir').get() //get the path of the application bundle
var moment = require('moment')
var ffmpeg = appRootDir+'/ffmpeg/ffmpeg'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

var ffParams = {
  inputFile: '',
  outputFile: '',
  quality: 20,
  vCodec: 'libx264',
  aCodec: 'libfacc'
}


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 400, height: 400, resizable: false})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
  exec('killall ffmpeg')
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('updateProgress', function (e, p) {
  win.setProgressBar(p)
})

ipcMain.on('removeProgress', function (e, p) {
  win.setProgressBar(-1)
})

ipcMain.on('runffmpeg', function (e, inputFile) {
  inputParts = path.parse(inputFile)
  inputParts.ext = '.mp4'
  inputParts.base = inputParts.name + inputParts.ext
  outputFile = path.format(inputParts)
  console.log(outputFile)
  argString = [ffmpeg + ' -y -i ' + '"' + inputFile + '"' +
              ' -c:v ' + ffParams.vCodec +
              ' -crf ' + ffParams.quality +
              ' ' + '"' + outputFile + '"']
                //ffmpeg -i input.wmv -c:v libx264 -crf 23 -c:a libfaac -q:a 100 output.mp4
  console.log(argString)
  const ff = execSync(argString)
  /*
  ff.on('exit', function() {
        //e.sender.send('updateFileList', inputParts.base);
        console.log("done!")
  })
  */
  /*
  ff.stdout.on( 'data', data => {
   console.log( `stdout: ${data}` );
  });
  ff.stderr.on( 'data', data => {
   console.log( `stderr: ${data}` );
  });
  */
})

/*
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
}) */

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
