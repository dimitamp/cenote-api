const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');
const uuid = require('uuid/v4');

const pid = () => `pid${uuid().replace(/-/g, '')}`;

const projectSchema = new mongoose.Schema({
	organization: { type: mongoose.Schema.ObjectId, ref: 'Organization', required: true },
	title: { type: String, lowercase: true, trim: true },
	createdAt: { type: Date, default: Date.now, immutable: true },
	updatedAt: { type: Date },
	projectId: { type: String, default: pid, immutable: true, unique: true },
	readKey: { type: String, default: uuid },
	writeKey: { type: String, default: uuid },
	masterKey: { type: String, default: uuid },
});

projectSchema.plugin(immutablePlugin);
projectSchema.methods.hide = function hide() {
	return R.omit(['__v', '_id'], this.toObject());
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
