import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

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

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Init database data
const eraseDatabaseOnSync = true;

const port = process.env.PORT || 5000;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if(eraseDatabaseOnSync){
        createUsersWithMessages();
    }
      
    app.listen(port, () => {
        console.log(`Application running on port: ${port}`);
    });
});

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: 'Jessy',
            messages: [
                {
                    text: 'Prepare for trouble',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );

    await models.User.create(
        {
            username: 'James',
            messages: [
                {
                    text: 'Make it double',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );

    await models.Item.create(
        {
            name: "Javel",
            date: Date.now()
        }
    )
};