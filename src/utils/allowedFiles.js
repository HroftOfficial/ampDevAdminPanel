const allowedFiles = {
	photo: { 'image/jpeg': ['.jpeg', '.jpg', '.png'] },
	plantFiles: {
		'application/vnd.ms-excel': ['.xls', '.xlsx'],
		'image/jpeg': ['.jpeg', '.jpg', '.png'],
		'image/gif': ['.gif'],
		'application/msword': ['.doc', '.docx'],
		'application/pdf': ['.pdf'],
	},
	draftFiles: {
		'application/vnd.ms-excel': ['.xls', '.xlsx'],
		'image/jpeg': ['.jpeg', '.jpg', '.png'],
		'image/gif': ['.gif'],
		'application/msword': ['.doc', '.docx'],
		'application/pdf': ['.pdf'],
		// 'application/acad': ['.dwg', '.dvg'],
	},
};

module.exports = allowedFiles;
