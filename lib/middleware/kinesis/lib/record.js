class Record {
	constructor(record) {
		if (record.kinesis && record.kinesis.data) {
			this.data = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('ascii'));
		}
	}
}

module.exports = Record;
