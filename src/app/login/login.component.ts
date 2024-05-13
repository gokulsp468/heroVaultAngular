import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customvalidator } from '../validator/customvalidator';
import { Subscription } from 'rxjs';
import { Loginservice } from './service/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,OnDestroy{

  constructor(private fb:FormBuilder,private loginservice :Loginservice,
    private toastr: ToastrService,
    private router: Router,
    ){}
 
  
  subscription!: Subscription;
  loginForm!: FormGroup;

  hidepassword:boolean = true;
  togglePassword(){
    this.hidepassword = !this.hidepassword;
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Customvalidator.validatePassword]],
    });
  }



  login(){
    if (this.loginForm.valid){
      this.subscription = this.loginservice.login(this.loginForm.value).subscribe({
        next:(response)=>{
          if(response.success && response.status_code == 200) {
            localStorage.setItem(
              'loginToken',
              response.data.access
            );
            this.router.navigateByUrl('/dashboard');
            
          }

        },
        error:(error)=>{
          if(error){
            this.toastr.error(error.error.error_message.non_field_errors[0])
            
          }
        }
      })
    }else{
      Object.keys(this.loginForm.controls).forEach(key=>{
        this.loginForm.get(key)?.markAsDirty()
      })
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
