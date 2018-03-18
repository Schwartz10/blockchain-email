import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { fetchWeb3 } from './store/web3'
import { fetchContract } from './store/contract'
import { fetchAccounts } from './store/accounts'
import { checkAccountConfig } from './store/configuredAccount'
import { updateTokenList } from './store/myTokens'
import { Button } from 'react-bootstrap'
import Routes from './components/Routes'
import { configuredAccount, openMetamask } from './ipcRendererEvents'

import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props, context) {
    super(props);
    this.collectBlockchainAndUserInfo = this.collectBlockchainAndUserInfo.bind(this);
  }

  componentWillMount() {
    this.collectBlockchainAndUserInfo();
  }

  async collectBlockchainAndUserInfo(e) {
    if (e) e.preventDefault();
    // Get network provider, web3, and truffle contract instance and store them on redux store
    const { web3 } = await this.props.getWeb3();
    const [{ contract }, { accounts }] = await Promise.all([this.props.getContract(web3), this.props.getAccounts(web3)]);

    // Get the current tokens owned by user, sets them on redux store
    let tokens = [];
    if(accounts.length){
      const tokenIdList = await contract.getNotesByOwner.call(accounts[0]);
      tokens = await Promise.all(tokenIdList.map(tokenId => contract.getNote.call(tokenId)));
    }
    this.props.setTokenList(tokens);

    // checks with the main process to make sure the current addressed logged in to metamask has an identity set up
    // if no address, send a 0
    configuredAccount(accounts[0] || '0');
    // listens for an answer from the main process
    chrome.ipcRenderer.once('checked-account-configuration',
      // returns the address if account is configured, otherwise false
      (event, configured) => {
        this.props.checkConfig(configured);
      })
  }


  render() {
    return (
      <div className="App">
        <Routes />
        <div id="metamask-options">
          <Button bsStyle="warning" onClick={openMetamask}>Open Metamask</Button>
          <Button bsStyle="info" onClick={this.collectBlockchainAndUserInfo.bind(this)}>Refresh Metamask</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    web3: state.web3,
    contract: state.contract,
    accounts: state.accounts
  }
}

function mapDispatchToProps(dispatch){
  return {
    getWeb3: function (){
      return dispatch(fetchWeb3());
    },
    getContract: function (web3){
      return dispatch(fetchContract(web3));
    },
    getAccounts: function (web3){
      return dispatch(fetchAccounts(web3));
    },
    checkConfig: function (address){
      return dispatch(checkAccountConfig(address))
    },
    setTokenList: function (tokens){
      return dispatch(updateTokenList(tokens))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
