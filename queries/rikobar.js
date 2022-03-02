const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, barAddress } = require('../constants')
const { timestampToBlock } = require('../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    bar(id: "${barAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.bar);
    },

    observeInfo() {
        const query = gql`
            subscription {
                bar(id: "${barAddress}") {
                    ${info.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.bar, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(info.callback(results.data.bar));
                    },
                    error,
                    complete
                });
            }
        };
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("patswap-data: User address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    user(id: "${user_address.toLowerCase()}", ${block}) {
                        ${user.properties.toString()}
                    }
                }`
        );

        return user.callback(result.user);
    },
}

const info = {
    properties: [
        'decimals',
        'name',
        'riko',
        'symbol',
        'totalSupply',
        'ratio',
        'xRikoMinted',
        'xRikoBurned',
        'rikoStaked',
        'rikoStakedUSD',
        'rikoHarvested',
        'rikoHarvestedUSD',
        'xRikoAge',
        'xRikoAgeDestroyed',
        'updatedAt'
    ],

    callback(results) {
        return ({
            decimals: Number(results.decimals),
            name: results.name,
            riko: results.riko,
            symbol: results.symbol,
            totalSupply: Number(results.totalSupply),
            ratio: Number(results.ratio),
            xRikoMinted: Number(results.xRikoMinted),
            xRikoBurned: Number(results.xRikoBurned),
            rikoStaked: Number(results.totalSupply) * Number(results.ratio),
            rikoStakedUSD: Number(results.rikoStakedUSD),
            rikoHarvested: Number(results.rikoHarvested),
            rikoHarvestedUSD: Number(results.rikoHarvestedUSD),
            xRikoAge: Number(results.xRikoAge),
            xRikoAgeDestroyed: Number(results.xRikoAgeDestroyed),
            updatedAt: Number(results.updatedAt)
        })
    }
};

const user = {
    properties: [
        'xRiko',
        'xRikoIn',
        'xRikoOut',
        'xRikoMinted',
        'xRikoBurned',
        'xRikoOffset',
        'xRikoAge',
        'xRikoAgeDestroyed',
        'rikoStaked',
        'rikoStakedUSD',
        'rikoHarvested',
        'rikoHarvestedUSD',
        'rikoIn',
        'rikoOut',
        'usdOut',
        'usdIn',
        'updatedAt',
        'rikoOffset',
        'usdOffset'
    ],

    callback(results) {
        return ({
            xRiko: Number(results.xRiko),
            xRikoIn: Number(results.xRikoIn),
            xRikoOut: Number(results.xRikoOut),
            xRikoMinted: Number(results.xRikoMinted),
            xRikoBurned: Number(results.xRikoBurned),
            xRikoOffset: Number(results.xRikoOffset),
            xRikoAge: Number(results.xRikoAge),
            xRikoAgeDestroyed: Number(results.xRikoAgeDestroyed),
            rikoStaked: Number(results.rikoStaked),
            rikoStakedUSD: Number(results.rikoStakedUSD),
            rikoHarvested: Number(results.rikoHarvested),
            rikoHarvestedUSD: Number(results.rikoHarvestedUSD),
            rikoIn: Number(results.rikoIn),
            rikoOut: Number(results.rikoOut),
            usdOut: Number(results.usdOut),
            usdIn: Number(results.usdIn),
            updatedAt: Number(results.updatedAt),
            rikoOffset: Number(results.rikoOffset),
            usdOffset: Number(results.usdOffset)
        })
    }
};