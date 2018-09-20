import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      thirdPartyAccount: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAccess = this.onAccess.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        this.setState({ thirdPartyAccount: accounts[1] })
        console.log(this.state.account)
        console.log(this.state.thirdPartyAccount)
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }

  captureFile(event) {
    //console.log('captureFile...')
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      // state.buffer holds the "buffer of the file" which was just created.  
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    //console.log('submitFile...')
    event.preventDefault()
    // add the submitted file to IPFS using 'add' function.
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
        // Get the value from the contract to prove it worked.
        return this.setState({ ipfsHash: result[0].hash }) // ipfsHash holds the hash for the file we uploaded. And we set it usinf setState
        console.log('ifpsHash', this.state.ipfsHash) // state.ipfsHash prints the hash of the file to console
      })
      // hash on console
      console.log(result[0].hash)
    })
  }

  onAccess(event) {
    event.preventDefault()
    console.log("on access invoked")

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    //this.setState({ thirdPartyAccount: "0x35635309f8d8454149b5a31e6b2134Ddb6aaBD64"})
    this.state.thirdPartyAccount = "0x35635309f8d8454149b5a31e6b2134Ddb6aaBD64"
    if(this.state.thirdPartyAccount !== this.state.account){
      this.simpleStorageInstance.transfer(this.state.account, 10, { from: this.state.thirdPartyAccount})
        console.log("notified to admin")
    }
    else
    {
      console.log("no rewards to you buddy! admin")
    }
    
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>

        var content = $('#content')
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Document</h1>
              <p>This document is stored on IPFS & The Ethereum Blockchain!</p>
              //<img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/> 
              <a href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} target="_blank">click for the file</a>
              <h2>Upload document</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
              <form onSubmit={this.onAccess} >
                <input type='submit' value='ThirdPartyAccess'/>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
