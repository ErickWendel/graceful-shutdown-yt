import {
    createServer
} from 'node:http'

import {
    once
} from 'node:events'

async function handler(request, response) {
    try {
        const data = JSON.parse(await once(request, 'data'))
        console.log('\nreceived', data)
        
        response.writeHead(200)
        response.end(JSON.stringify(data))
    } catch (error) {
        console.log('error!!', error)
        response.writeHead(500)
        response.end()
    }

    setTimeout(() => {
        throw new Error('will be handled on uncaught')
    }, 1000);
    Promise.reject('will be handled on unhandedRejection')
    throw new Error('will be handled on unhandedRejection - its wrapped on the asyncfn')
    
}

const server = createServer(handler)
    .listen(4000, () => console.log('listening to 4000'))

function gracefulShutdown(code) {
    return event => {
        console.info(`${event} signal received with code ${code}`);
        console.log('Closing http server...');
        server.close(() => {
            console.log('Http server closed.');
            console.log('Closed DB connection...');
            process.exit(0);
        });
    }
}

// generated with < Ctrl > +C in the terminal.
// The 'SIGTERM' signal is a generic signal used to cause program termination
process.on('SIGINT', gracefulShutdown('SIGINT'));

// not supported on Windows
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

process.on('exit', (code) => {
    console.info('exit signal received.', code);
});

// sem ele a aplicação morre
process.on('uncaughtException', (error, origin) => {
    console.info(`\n${origin} signal received.\n${error}` );
});

// sem ele a aplicação joga um warn
process.on('unhandledRejection', (error, origin) => {
    console.info(`\nunhandledRejection signal received.\n${error}`);
});