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
		delete this.data;
	}

	drop() {
		this.result = "Dropped";
		delete this.data;
	}

	failure() {
		this.result = "ProcessingFailed";
		delete this.data;
	}
}

module.exports = Record;
