class Record {
	constructor(record) {
		if (record.data) {
			this.data = JSON.parse(Buffer.from(record.data, 'base64').toString('ascii'));
			console.log("3) DATA FROM EVENT PREPROCESSING", this.data);
		}
		this.recordId = record.recordId;
		this.result = undefined;
	}

	success() {
		this.result = "Ok";
		console.log("4) DATA AFTER PREPROCESSING", this.data);
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
