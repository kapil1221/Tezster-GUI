import React, { Component } from 'react';
import { connect } from 'react-redux';
import Workspace from '../components/Workspace';
import {
  sidebarToggleAction,
  handleAccordionAction,
  handleTabChangeAction
} from '../actions/Workspace/sidebar';

import {
  getAccountsAction,
  createAccountsAction,
  restoreAccountAction,
  toggleAccountsModalAction,
  getBalanceAction
} from '../actions/Workspace/accounts';
import {
  toggleTransactionModalAction,
  executeTransactionAction,
  getTransactionsAction,
  selectTransactionWalletAction
} from '../actions/Workspace/transactions';
import {
  handleContractsTabChangeAction,
  deployContractAction
} from '../actions/Workspace/contracts';
import {
  getDashboardHeaderAction,
  handleNetworkChangeAction
} from '../actions/Workspace/dashboardHeader';
import checkTezsterCliAction from '../actions/Onboard';
import Error from '../components/Error';

class WorkspacePage extends Component {
  componentDidMount() {
    this.props.checkTezsterCliAction();
  }

  render() {
    if (this.props.isAvailableTezsterCli) {
      return <Workspace {...this.props} />;
    }
    return <Error {...this.props} />;
  }
}
const mapDispatchToProps = dispatch => ({
  restoreAccountAction: payload => dispatch(restoreAccountAction(payload)),
  handleNetworkChangeAction: payload =>
    dispatch(handleNetworkChangeAction(payload)),
  toggleTransactionModalAction: payload =>
    dispatch(toggleTransactionModalAction(payload)),
  getBalanceAction: payload => dispatch(getBalanceAction(payload)),
  getAccountsAction: payload => dispatch(getAccountsAction(payload)),
  getTransactionsAction: payload => dispatch(getTransactionsAction(payload)),
  deployContractAction: payload => dispatch(deployContractAction(payload)),
  createAccountsAction: payload => dispatch(createAccountsAction(payload)),
  toggleAccountsModalAction: payload =>
    dispatch(toggleAccountsModalAction(payload)),
  getDashboardHeaderAction: payload =>
    dispatch(getDashboardHeaderAction(payload)),
  sidebarToggleAction: payload => dispatch(sidebarToggleAction(payload)),
  selectTransactionWalletAction: payload =>
    dispatch(selectTransactionWalletAction(payload)),
  handleTabChangeAction: payload => dispatch(handleTabChangeAction(payload)),
  executeTransactionAction: payload =>
    dispatch(executeTransactionAction(payload)),
  handleContractsTabChangeAction: payload =>
    dispatch(handleContractsTabChangeAction(payload)),
  checkTezsterCliAction: payload => dispatch(checkTezsterCliAction(payload)),
  handleAccordionAction: payload => dispatch(handleAccordionAction(payload))
});
const mapStateToProps = state => ({
  currentTab: state.currentTab,
  userAccounts: state.userAccounts,
  showTransactionModal: state.showTransactionModal,
  showAccountsModal: state.showAccountsModal,
  dashboardHeader: state.dashboardHeader,
  userBalances: state.userBalances,
  sidebarToggleState: state.sidebarToggleState,
  blockAccordionIndex: state.blockAccordionIndex,
  userTransactions: state.userTransactions,
  selectedTransactionWallet: state.selectedTransactionWallet,
  transactionsSuccess: state.transactionsSuccess,
  selectedContractsTab: state.selectedContractsTab,
  isAvailableTezsterCli: state.isAvailableTezsterCli
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacePage);
