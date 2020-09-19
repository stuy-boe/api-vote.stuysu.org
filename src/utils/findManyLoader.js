const Dataloader = require('dataloader');
const mongoose = require('mongoose');

const findManyLoader = (model, field, conditions = {}, extraParams = []) =>
	new Dataloader(
		async keys => {
			const Model = mongoose.model(model);

			const keyMap = {};

			const uniqueKeys = [...new Set(keys)];
			const entries = await Model.find(
				{
					[field]: { $in: uniqueKeys },
					...conditions
				},
				...extraParams
			);

			for (let x = 0; x < entries.length; x++) {
				const entry = entries[x];
				const key = entry[field];

				if (!keyMap[key]) {
					keyMap[key] = [];
				}

				keyMap[key].push(entry);
			}

			const response = [];

			for (let x = 0; x < keys.length; x++) {
				const key = keys[x];
				response.push(keyMap[key] || []);
			}

			return response;
		},
		{ cache: false }
	);

module.exports = findManyLoader;
