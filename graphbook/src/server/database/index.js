import Sequelize from 'sequelize';
import configFile from '../config/';

// const sequelize = new Sequelize('graphbook_dev', 'devuser', '3EkgzHAY_Xgb5vHXhCXU3X', {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// });

// export default sequelize;


const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const sequelize = new Sequelize(config.database,
config.username, config.password, config);
const db = {
    sequelize,
};

export default db;