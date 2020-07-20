module.exports.postCreate = (req, res, next) => {
	const errors = [];
	if (!req.body.name) {
		errors.push('Name Product is required.');
	}
	if (errors.length) {
		res.render('products/create', {
			errors: errors,
			values: req.body,
		});
		return;
	}
	next();
};
