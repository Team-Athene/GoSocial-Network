/** @format */

import { Injectable } from '@angular/core'
import { BehaviorSubject, interval, Subscription } from 'rxjs'
import { Web3Model } from '../../Models/web3.model'

declare let require: any

const Web3 = require('web3')
let FMSJSON
declare let window: any
declare let ethereum: any
declare let web3: any

// anugalr service to loggin with metamask

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  constructor() {}
  public Web3Details$: BehaviorSubject<Web3Model> = new BehaviorSubject<
    Web3Model
  >({
    account: null,
    network: null,
    fms: null
  })
  private RefreshedAccount = interval(1000)
  public AccountSubscription: Subscription
  public async web3login() {
    FMSJSON = require('../../../../build/contracts/fms.json')
    return new Promise(async (resolve, reject) => {
      // check dapp browser
      if (window.ethereum || window.web3) {
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
          } catch (error) {
            // User denied account access...
            reject(error)
          }
        } else {
          window.web3 = new Web3(web3.currentProvider)
        }
        // check contract deployed on this network
        const Net = await this.GetNetwork()
        if (typeof FMSJSON.networks[Net] === 'undefined') {
          reject('Contract Not Deployed on Network with Id:' + Net)
        }
        // observe changes on  account and network
        this.AccountSubscription = this.RefreshedAccount.subscribe(async () => {
          let Account = await this.GetAccount()
          const Network = await this.GetNetwork()
          if (
            this.Web3Details$.value.network !== Network ||
            this.Web3Details$.value.account !== Account
          ) {
            const fmsInstance = new window.web3.eth.Contract(
              FMSJSON.abi,
              FMSJSON.networks[Network].address
            )
            this.Web3Details$.next({
              account: Account,
              network: Network,
              fms: fmsInstance.methods
            })
          }
          localStorage.setItem('isLogged', 'true')
          if (Account == null) {
            await this.web3logout()
            Account = null
            reject('Something Went Wrong')
          }
          resolve('Logged In')
        })
      } else {
        reject(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    })
  }
  // logout function
  public async web3logout() {
    this.AccountSubscription.unsubscribe()
    this.Web3Details$.next({
      account: null,
      network: null,
      fms: null
    })
    localStorage.setItem('isLogged', 'false')
    localStorage.clear()
  }
  private async GetAccount(): Promise<string> {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          resolve(null)
        }
        // Get the initial account balance so it can be displayed.
        if (accs.length === 0) {
          resolve(null)
        } else {
          resolve(accs[0])
        }
      })
    })
  }
  private GetNetwork(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.web3.eth.net.getId((err, netId) => {
        if (err) {
          reject('Something Went Wrong, while getting network ID ')
        }
        resolve(netId)
      })
    })
  }
}
