const child_process = require('child_process')
const chokidar = require('chokidar');
const npm = require('npm');

function compile_client(){
    return new Promise((res,rej)=>{
        child_process.exec('npm run build:ssr:client',function(error, stdout, stderr){
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
                rej()
            }
            res()
        })
    })
}

function compile_server(){
    return new Promise((res,rej)=>{
        child_process.exec('npm run build:ssr:server',function(error, stdout, stderr){
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
                rej()
            }
            res()
        })
    })
}

function reload_entry(){
    return new Promise((res,rej)=>{
        child_process.exec('node houtai.js',function(error, stdout, stderr){
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
                rej()
            }
            res()
        })
    })
}

function directives(commond,cb){
    npm.load(function(){
        npm.commands.cache(['clean'], function(){
            npm.commands.run([commond],cb);
        })
    })
}

const watcher = chokidar.watch('./ssr');

watcher.on('all', (event, path)  => {
    if(event === 'change'){
        console.log('ssr 发生变化，开始进行热更新');
        // await compile_client()
        // await compile_server()
        try{
            directives('build:ssr:client',directives('build:ssr:server'))
        }
        catch(error){
            console.log(error)
        }

    }
});

