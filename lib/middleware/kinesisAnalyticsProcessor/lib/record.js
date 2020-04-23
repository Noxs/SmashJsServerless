class Record {
	constructor(record) {
		if (record.data) {
			this.data = JSON.parse(Buffer.from(record.data, 'base64').toString('ascii'));
		}
		this.recordId = record.recordId;
		this.result = undefined;
	}

	success() {
		this.result = "Ok";
		this.data = new Buffer(JSON.stringify(this.data)).toString('base64');
	}

	drop() {
		this.result = "Dropped";
	}

	failure() {
		this.result = "ProcessingFailed";
	}
}

module.exports = Record;
