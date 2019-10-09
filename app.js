require('dotenv').config();

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const express = require('express');
const app = express();
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');

const cookieSession = require('cookie-session'); 
const passport = require('passport');

// Connect to mongodb
mongoose.connect(process.env.DB_URI, () => {
	console.log('Connected to mongodb');
});

// Using cookie-session
app.use(cookieSession({

	// setting life of cookie
	maxAge: 24 * 60 * 60 * 1000,

	// encrypting cookie
	keys: [process.env.COOKIE_KEY] 
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// view engine -> EJS
app.set('view engine', 'ejs');

let port = process.env.PORT;
if(port == null || port == ""){
	port = 3000;
}
app.listen(port, function(){
	console.log('Server running successfully.')
});

// Homepage route
app.get('/', (req,res)=>{
	res.render('home', {user: req.user});
});

// setup routes from 'routes'
app.use('/auth',authRoutes);

// profile routes
app.use('/profile',profileRoutes);