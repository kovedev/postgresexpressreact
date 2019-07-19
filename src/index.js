import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import bcrypt from 'bcryptjs';

import models, { sequelize} from './models';
import routes from './routes';

const app = express();

// Middleware

// https://github.com/expressjs/cors
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('James'),
    };
    next();
});

// Routes
app.use('/api/session', routes.session);
app.use('/api/users', routes.user);
app.use('/api/messages', routes.message);
app.use('/api/items', routes.item);
app.use('/api/auth', routes.auth);

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
if (process.env.NODE_ENV === 'local') {
    app.use(express.static('public'));
}

// Init database data
const eraseDatabaseOnSync = false;

const port = process.env.PORT || 5000;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if(eraseDatabaseOnSync){
        createItem('Javel')
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash('james123', salt, (err, hash) => {
                if(err) throw err;
                createUserWithMessages('Jessy', hash, 'jessy@rocket.pkm', 'Prepare for trouble');
            })
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash('james123', salt, (err, hash) => {
                if(err) throw err;
                createUserWithMessages('James', hash, 'james@rocket.pkm', 'Prepare for trouble');
            })
        })
    }

    app.listen(port, () => {
        console.log(`Application running on port: ${port}`);
    });
});

const createUserWithMessages = async (name, hash, email, message) => {
    await models.User.create(
        {
            username: name,
            email: email,
            password: hash,
            messages: [
                {
                    text: message,
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
};

const createItem = async (name) => {
    await models.Item.create(
        {
            name: name,
            date: Date.now()
        }
    )
}