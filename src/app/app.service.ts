import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { configDataTpye } from '../assets/configTypeData';
import { transactionType } from '../assets/transactionType';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

declare var eztz: any;
declare var conseiljs: any;
@Injectable()
export class AppService {
	private _url: string = '/assets/config.json';
	private _transactionURL: string;
	public keys: any;
	protected _configData: any;
	protected _transactionData: any;
	public amount: any;
	public configDataChangeObs$: BehaviorSubject < any > ;
	public data = '';
	public obj: any;
	private maxTxs = 20;
	public trans: any;
	public transactionDataChangeObs$: BehaviorSubject < any > ;
	public opHash: any;
	contractData: {
		"label": any;
		"pkh": any;
		"identity": any;
	};
	transHash: {
		"operation": any;
		"hash": any;
		"from": any;
		"to": any;
		"amount": any;
		"status": any;
		"time": any
	};
	constructor(private http: HttpClient) {
		this.configDataChangeObs$ = new BehaviorSubject < any > (null);
	}
	fetchConfigData(): Observable < configDataTpye[] > {
		const ajax = this.http.get < configDataTpye[] > (this._url).catch(this.errorHandler);
		ajax.subscribe(this._onConfigDataResponse.bind(this));
		return ajax;
	}
	loadtransactionData(key: any): Observable < transactionType[] > {
		this._transactionURL = 'https://api.alphanet.tzscan.io/v3/operations/' + key + '?type=Transaction&p=0&number=' + (this.maxTxs + 1);
		const transajax = this.http.get < transactionType[] > (this._transactionURL).catch(this.errorHandler);
		transajax.subscribe(this._transactionDataResponse.bind(this));
		return transajax;
	}
	protected _onConfigDataResponse(data: any) {
		this.configData = data;
		this.setLocalConfigData(data);
	}
	protected _transactionDataResponse(data: any) {
		this.setLocaltransactionData(data);
	}
	public setLocaltransactionData(data: string) {
		data = JSON.stringify(data);
		localStorage.setItem('transactionData', data);
	}
	public setLocalConfigData(data: string) {
		data = JSON.stringify(data);
		localStorage.setItem('configData', data);
	}
	public getLocalConfigData() {
		return localStorage.getItem('configData');
	}
	public getLocaltransactionData() {
		return localStorage.getItem('transactionData');
	}
	errorHandler(error: HttpErrorResponse) {
		return Observable.throw(error.message || 'Server Error');
	};
	public addAccount(data: {
		'label': string;
		'pkh': string;
		'identity': string;
	}) {
		this.configData.accounts.push(data);
		this.obj = JSON.parse(this.getLocalConfigData());
		this.obj.accounts.push(data);
		this.setLocalConfigData(this.obj);
	}
	public setProviderData(data: string) {
		this.configData.provider = data;
		this.obj = JSON.parse(this.getLocalConfigData());
		this.obj.provider = data;
		this.setLocalConfigData(this.obj);
	}
	public get configData() {
		return this._configData;
	}
	public set configData(data) {
		this._configData = data;
		this.configDataChangeObs$.next(data);
	}
	public getBalance(keys: string) {
		return new Promise((resolve, reject) => {
			eztz.rpc.getBalance(keys).then((res: number) => {
				this.amount = (res / 1000000).toFixed(3) + ' Tz';
				resolve(this.amount);
			}).catch((e: any) => {
				reject(e);
			});
		});
	}
	public transferAmount(data: any) {
		return new Promise((resolve, reject) => {
			this.keys = JSON.parse(localStorage.getItem("keys"));
			eztz.rpc.transfer(data.from, this.keys, data.to, data.amount, 1400).then(function (r: {
				hash: any;
			}) {
				resolve(r.hash);
			}).catch(function (e: any) {
				alert(e);
				reject(e);
			});
		});
	}
	async deployContract(keys: any, contract: any, label: any, init: any, tezosProvider: any, keysStore: any) {
		let initValue = '\"' + init + '\"';
		let res: any;
		try {
			const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(tezosProvider, keysStore, 0, undefined, false, true, 100000, '', 1000, 100000, contract, initValue, conseiljs.TezosParameterFormat.Michelson);

			if (result.results) {
				switch (result.results.contents[0].metadata.operation_result.status) {
					case 'applied':
						this.opHash = result.operationGroupID.slice(1, result.operationGroupID.length - 2);
						this.opHash = eztz.contract.hash(this.opHash);
						this.contractData = {
							"label": label,
							"pkh": this.opHash,
							"identity": keys
						};
						this.obj = JSON.parse(this.getLocalConfigData());
						this.obj.contracts.push(this.contractData);
						this.setLocalConfigData(this.obj);
						res = `contract ${label} has been deployed at ${this.opHash}`;
						alert(res);
						return res;
					case 'failed':
					default:
						res = "Contract deployment has failed :" + result.results.contents[0].metadata.operation_result;
						alert(res);
						return res;
				}
			}
			res = "Contract deployment has failed :" + result;
			alert(res);
		} catch (error) {
			alert(error);
			return error;
		}
	}

	async callContract(keys: any, label: any, init: any, tezosProvider: any, keysStore: any) {
		let initValue = '\"' + init + '\"';
		let res: any;
		try {
			let result = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(
				tezosProvider, keysStore, keys, 0, 100000, '', 1000, 100000, initValue, conseiljs.TezosParameterFormat.Michelson);
			if (result.results) {
				switch (result.results.contents[0].metadata.operation_result.status) {
					case 'applied':
						let opHash = result.operationGroupID.slice(1, result.operationGroupID.length - 2);
						this.transHash = {
							"operation": "contract-call",
							"hash": opHash,
							"from": keys,
							"to": label,
							"amount": 0,
							"status": "Success",
							"time": ""
						};
						this.obj = JSON.parse(this.getLocalConfigData());
						this.obj.transactions.push(this.contractData);
						this.setLocalConfigData(this.obj);
						let res = "Injected operation with hash" + opHash;
						alert(res);
						return res;
					case 'failed':
					default:
						res = "Contract calling has failed due to node error :" + result.results.contents[0].metadata.operation_result;
						alert(res);
						return res;
				}
			}
			res = "Contract calling has failed :" + result;
			alert(res);
			return res;
		} catch (error) {
			return error;
		}
	}

	async getStorage(contractAddress: any) {
		try {
			let storage = await eztz.contract.storage(contractAddress);
			alert(JSON.stringify(storage));
			return (JSON.stringify(storage));
		} catch (error) {
			alert(error);
			return (error);
		}
	}
}