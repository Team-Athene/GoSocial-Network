/** @format */

import { Component, OnInit, DoCheck, Input } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Router } from '@angular/router'
import { Web3Service } from 'src/app/Services/Web3/web3.service'

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  @Input()
  ContentType: number

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(map(result => result.matches))
    
  constructor(
    private web3service: Web3Service,
    private breakpointObserver: BreakpointObserver,
    private route: Router
  ) {}
  //To Log Out
  logOut = async () => {
    this.web3service.web3logout()
    this.route.navigateByUrl('/')
  }
  //To Log In
  logIn = async () => {
    this.web3service.web3login()
    this.route.navigateByUrl('/User')
  }
}
