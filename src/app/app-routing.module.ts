import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './Components/home/home.component'
import { UserComponent } from './Components/user/user.component'
import { UserGuard } from './Guards/User/user.guard'


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'User',
    component: UserComponent,
    canActivate: [UserGuard]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
