import React from 'react';

function Table(props) {
  const Accounts = props.userAccounts.map((elem, index) => {
    return (
      <tr className="table-row" key={elem.account + index}>
        <td className="table-body-cell">
          <div className="cards-header">
            <h4>ADDRESS</h4>
          </div>
          <div className="cards-contents">
            <p className="account-address-content">{elem.account}</p>
          </div>
        </td>
        <td className="table-body-cell">
          <div className="cards-header">
            <h4>BALANCE</h4>
          </div>
          <div className="cards-contents">
            <p className="account-address-content">{elem.balance} Tz</p>
          </div>
        </td>
        <td className="table-body-cell">
          <div className="cards-header">
            <h4>TX COUNT</h4>
          </div>
          <div className="cards-contents">
            <p className="account-address-content">0</p>
          </div>
        </td>
        <td className="table-body-cell">
          <div className="cards-header">
            <h4>INDEX</h4>
          </div>
          <div className="cards-contents">
            <p className="account-address-content">0</p>
          </div>
        </td>
        <td className="table-body-cell">
          <span className="icon-key" />
        </td>
      </tr>
    );
  });
  return (
    <div className="accounts-table-container">
      <table className="table table-striped table-bordered">
        <tbody>{Accounts}</tbody>
      </table>
    </div>
  );
}

export default Table;
