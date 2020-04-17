/* eslint-disable promise/always-return */
import axios from 'axios';

import { TzStatsApiEndpoint } from './config';

export function getBlockHeight(args, callback) {
  const url = TzStatsApiEndpoint[args.dashboardHeader.networkId];
  axios
    .get(`${url}/explorer/block/head`)
    .then(response => {
      callback(null, response.data);
    })
    .catch(exception => {
      callback(exception, null);
    });
}

export function getBlockData(args, callback) {
  const url = TzStatsApiEndpoint[args.dashboardHeader.networkId];
  axios
    .get(`${url}/explorer/block/${args.blockId}`)
    .then(response => {
      callback(null, response.data);
    })
    .catch(exception => {
      callback(exception, null);
    });
}