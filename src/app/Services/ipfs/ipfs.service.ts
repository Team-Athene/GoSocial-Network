import { Injectable } from '@angular/core'
// import ipfsClient from 'ipfs-http-client'
import ipfs from 'ipfs'
@Injectable( {
  providedIn: 'root'
} )
export class IpfsService {

  node: any
  constructor () {

  }
  init = async () => {
    try {
      this.node = await ipfs.create()
    } catch ( error ) {
    }
  }
  IPFSadd = async ( data: any ) => {
    try {
      await this.init()
      const cid = await this.node.add( data )
      return this.IPFSstop( cid[ 0 ].hash )
    } catch ( error ) {
      return error;
    }
  }
  IPFSget = async ( cid: any ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        await this.init()
        const receviedData = await this.node.cat( cid )
        resolve( await this.IPFSstop( receviedData.toString() ) )
      } catch ( error ) {
        reject(error)
      }
    } )
  }
  IPFSstop = async ( data: any ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        await this.node.stop()
        resolve( data )
      } catch ( error ) {
        reject( error )
      }
    } )
  }

}
