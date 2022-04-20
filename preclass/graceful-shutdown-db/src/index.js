import {
    createServer
} from 'node:http'
import {
    getHeroModel,
    sequelize
} from './db.js';
import {
    once
} from 'node:events'

const Hero = await getHeroModel()
async function handler(request, response) {
    try {
        const data = JSON.parse(await once(request, 'data'))
        console.log('received', data)

        await Hero.create(data)
        const all = await Hero.findAll()
        response.writeHead(200)
        response.end(JSON.stringify(all))
        response.end()
    } catch (error) {
        console.log('error!!', error)
        response.writeHead(500)
        response.end()
    }
}
 


const server = createServer(handler)
    .listen(4000, () => console.log('listening to 4000'))

function gracefulShutdown(code) {
    return event => {
        console.info(`${event} signal received with code ${event}`);
        console.log('Closing http server...');
        server.close(async () => {
            console.log('Http server closed.');

            console.log('Closing DB connection...');
            await sequelize.close()
            console.log('Sequelize connection closed.');
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

process.on('uncaughtException', (error, origin) => {
    console.info(`\n${origin} signal received.`, error);
});

process.on('unhandledRejection', (error, origin) => {
    console.info(`\nunhandledRejection signal received.`, error);
});