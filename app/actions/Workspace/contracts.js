/* eslint-disable promise/always-return */
import swal from 'sweetalert';
import {
  __deployContract,
  __getBalance,
  __getStorage,
  __invokeContract
} from '../../apis/eztz.service';

export function handleContractsTabChangeAction(tabName) {
  return {
    type: 'CONTRACTS_TAB_TOGGLE',
    payload: tabName
  };
}

export function deployContractAction({ ...params }) {
  return dispatch => {
    dispatch({
      type: 'BUTTON_LOADING_STATE',
      payload: true
    });
    __deployContract({ ...params }, (err, response) => {
      if (err) {
        swal('Error!', 'Contract deployment failed', 'error');
        return dispatch({
          type: 'DEPLOY_CONTRACT_ERR',
          payload: response
        });
      }
      swal('Success!', `Contract ${response} deployed successfully`, 'success');
      return dispatch({
        type: 'DEPLOY_CONTRACT_SUCCESS',
        payload: response
      });
    });
  };
}

export function getContractStorageAction({ ...params }) {
  return dispatch => {
    dispatch({
      type: 'BUTTON_LOADING_STATE',
      payload: true
    });
    __getStorage({ ...params }, (err, response) => {
      if (err) {
        swal(
          'Error!',
          'Contract storage not available on selected network',
          'error'
        );
        dispatch({
          type: 'BUTTON_LOADING_STATE',
          payload: false
        });
        return dispatch({
          type: 'DEPLOY_CONTRACT_STORAGE_ERR',
          payload: err
        });
      }
      dispatch({
        type: 'BUTTON_LOADING_STATE',
        payload: false
      });
      return dispatch({
        type: 'DEPLOY_CONTRACT_STORAGE',
        payload: response
      });
    });
  };
}

export function getAccountBalanceAction({ ...params }) {
  return dispatch => {
    __getBalance({ ...params })
      .then(response => {
        dispatch({
          type: 'GET_CONTRACT_AMOUNT',
          payload: response.balance
        });
      })
      .catch(err => {
        dispatch({
          type: 'GET_CONTRACT_AMOUNT_ERR',
          payload: err
        });
      });
  };
}

export function handleInvokeContractAction({ ...params }) {
  return dispatch => {
    dispatch({
      type: 'BUTTON_LOADING_STATE',
      payload: true
    });
    __invokeContract({ ...params }, (err, response) => {
      if (err) {
        swal('Error!', 'Contract invocation failed', 'error');
        return dispatch({
          type: 'INVOKE_CONTRACT_ERR',
          payload: err
        });
      }
      swal('Success!', `${response} originated contract`, 'success');
      return dispatch({
        type: 'INVOKE_CONTRACT',
        payload: response
      });
    });
  };
}
