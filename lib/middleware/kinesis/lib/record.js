class Record {
	constructor(record) {
		if (record.kinesis && record.kinesis.data) {
			this.data = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('utf-8'));
		}
	}
}

module.exports = Record;
