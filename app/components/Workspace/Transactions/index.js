import React, { Component } from 'react';
import TransactionModal from './TransactionModal';
import TransactionTable from './TransactionTable';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      accountId: '0'
    };
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ accountId: event.target.value });
    this.props.selectTransactionWalletAction({
      accountId: event.target.value,
      ...this.props
    });
  }

  handleModalToggle() {
    this.props.toggleTransactionModalAction(!this.props.showTransactionModal);
  }

  render() {
    const Accounts = this.props.userAccounts.map((elem, index) => (
      <option key={elem.account + index} value={elem.account}>
        {elem.account}
      </option>
    ));
    const Transactions =
      this.props.userTransactions.length > 0 ? (
        <TransactionTable {...this.props} />
      ) : (
        <div>No Transactions To Display</div>
      );
    return (
      <>
        <div className="transaction-container">
          <div className="cards-container">
            <div className="cards button-card accounts-button-container">
              <div className="button-accounts">
                <button
                  type="button"
                  onClick={this.handleModalToggle}
                  className="btn btn-success"
                >
                  Transfer Tezos
                </button>
              </div>
            </div>
          </div>
          <div className="transactions-contents">
            <div className="modal-input">
              <div className="input-container">Select Wallet </div>
              <select
                className="custom-select"
                name="accounts"
                onChange={this.handleInputChange}
                value={this.props.selectedTransactionWallet}
              >
                <option value="0" disabled>
                  Select account to display transactions
                </option>
                {Accounts}
              </select>
            </div>
          </div>
          <div className="transactions-contents">{Transactions}</div>
          {this.props.showTransactionModal ? (
            <TransactionModal
              {...this.props}
              {...this.state}
              handleModalToggle={this.handleModalToggle}
            />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}

export default Transactions;
