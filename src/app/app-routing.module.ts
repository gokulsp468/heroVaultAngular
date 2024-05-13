import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CategoriesComponent } from './categories/categories.component';
import { DiscountComponent } from './discount/discount.component';
import { UserComponent } from './user/user.component';
import { StoreComponent } from './store/store.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'dashboard',component:NavbarComponent,children:[
    {path:'',component:CategoriesComponent},
    {path:'discount',component:DiscountComponent},
    {path:'user',component:UserComponent},
    {path:'store',component:StoreComponent}

  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
