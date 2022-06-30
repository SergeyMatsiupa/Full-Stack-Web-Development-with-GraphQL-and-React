import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import express from 'express';
import services from './services';
import path from 'path';
// import sequelize from './database'

const root = path.join(__dirname, '../../');

const app = express();

if(process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "*.amazonaws.com"]
        }
    }));
    app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
}

app.use(compress());

app.use(cors());

// app.get('/', function (req, res, next) {
//         console.log('first function');
//         next();
//     }, function (req, res) {
//         console.log('second function');
//         res.send('Hello World!');
//     });



// import path from 'path';

// const root = path.join(__dirname, '../../');

app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
    res.sendFile(path.join(root, '/dist/client/index.html'));
});



// app.get('/', function (req, res, next) {
//     var random = Math.random() * (10 -1) + 1;
//     if (random > 5) next('route')
//     else next()
// }, function (req, res, next) {
//     res.send('first');
// })
// app.get('/', function (req, res, next) {
//     res.send('second!');
// })



const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
    const name = serviceNames[i];
    if (name === 'graphql') {
        (async () => {
            await services[name].start();
            services[name].applyMiddleware({ app });
    })();
    } else {
        app.use('/${name}', services[name]);
    }
}

// console.log('sequelize', sequelize);

app.listen(8000, () => console.log('Listening on port 8000!'));

