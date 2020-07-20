const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
	if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
		cb(new Error('File is not supported'), false);
		return;
	} else {
		cb(null, true);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: fileFilter,
});

module.exports = upload;
