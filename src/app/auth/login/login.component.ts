import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

// declare const gapi: any;
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn: ElementRef | any;

  public formSubmitted = false;
  public auth2: any;

  public loginForm: any = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [false]
  });


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {

  }
  ngAfterViewInit(): void {
    this.googleInit();
  }

   googleInit() {
    google.accounts.id.initialize({
      client_id:
        "925612984899-clbj00s5h37d6gvo8vg9o0di9fm8vr0g.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" } // customization attributes
    );
  }

  handleCredentialResponse( response: any ) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp =>{
        // console.log({login: resp})
        this.ngZone.run( () => {
          this.router.navigateByUrl('/');
        })
      })
  }

  login(){

    this.usuarioService.login(this.loginForm.value)
      .subscribe( resp => {

        if( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', this.loginForm.get('email').value );
        } else {
          localStorage.removeItem('email');

        }

        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      } )
    // console.log(this.loginForm.value)



  }

}
