import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { CategoriesComponent } from './categories/categories.component';
import { StoreComponent } from './store/store.component';
import { DiscountComponent } from './discount/discount.component';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_SERVICE_CONFIG, App_CONFIG } from './appconfig/appconfig.service';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
// import { customInterceptor } from './custom.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { NodatafoundComponent } from './nodatafound/nodatafound.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    CategoriesComponent,
    StoreComponent,
    DiscountComponent,
    UserComponent,
    LoginComponent,
    NodatafoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule ,
    NgbDropdownModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgpImagePickerModule,
    HttpClientModule,
    ToastrModule.forRoot(), 
  ],
  providers: [
    {provide:APP_SERVICE_CONFIG,
      useValue:App_CONFIG
    
    },

    // provideHttpClient(
    //   withInterceptors([
    //     customInterceptor,
    //     // They can be inlined too, with full type safety!
    //     (req, next) => next(req),
    //   ]),
    // ),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
