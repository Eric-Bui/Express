const mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGO_URL,

	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	(err) => {
		if (!err) {
			console.log('Mongo connected sucessfully!');
		} else {
			console.log(err);
		}
	}
);
