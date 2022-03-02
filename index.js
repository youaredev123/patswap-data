'use strict';

const pageResults = require('graph-results-pager');

const { Promise } = require('bluebird')

const { graphAPIEndpoints } = require('./constants')

const sushi = require('./queries/sushi');
const riko = require('./queries/riko');
const blocks = require('./queries/blocks');
const charts = require('./queries/charts');
const exchange = require('./queries/exchange');
const exchange_v1 = require('./queries/exchange_v1')
const masterchef = require('./queries/masterchef');
const bar = require('./queries/bar')
const maker = require('./queries/maker')
const timelock =  require('./queries/timelock');
const lockup = require('./queries/lockup');
const bentobox = require('./queries/bentobox');
const utils = require('./utils');

module.exports = {
	pageResults,
	graphAPIEndpoints,
	sushi,
	riko,
	blocks,
	charts,
	exchange,
	exchange_v1,
	masterchef,
	bar,
	maker,
	timelock,
	lockup,
	bentobox,
	utils,
	async timeseries({blocks = undefined, timestamps = undefined, target = undefined} = {}, targetArguments) {
		if(!target) { throw new Error("patswap-data: Target function undefined"); }
		if(!blocks && !timestamps) { throw new Error("patswap-data: Timeframe undefined"); }

		if(blocks) {
			return Promise.map(blocks, async (block) => ({
				block,
				data: await target({block, ...targetArguments})
			}));
		}

		else {
			return Promise.map(timestamps, async (timestamp) => ({
				timestamp,
				data: await target({timestamp, ...targetArguments})
			}));
		}
	},
};
