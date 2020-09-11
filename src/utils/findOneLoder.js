const Dataloader = require('dataloader');
const mongoose = require('mongoose');

const findOneLoader = (model, key = '_id', conditions = {}) => {
	return new Dataloader(
		async keyValues => {
			const keyMap = {};

			const Model = mongoose.model(model);

			const uniqueKeys = [...new Set(keyValues)];
			const results = await Model.find({
				[key]: { $in: uniqueKeys },
				...conditions
			});

			for (let x = 0; x < results.length; x++) {
				const instance = results[x];
				keyMap[instance[key]] = instance;
			}

			const response = [];

			for (let x = 0; x < keyValues.length; x++) {
				const keyVal = keyValues[x];
				response.push(keyMap[keyVal] || null);
			}

			return response;
		},
		{ cache: false }
	);
};

module.exports = findOneLoader;
