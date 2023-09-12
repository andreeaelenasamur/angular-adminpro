import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm: any = this.fb.group({
    nombre: ['Fernando', Validators.required ],
    email: ['test100@gmail.com', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    password2: ['', Validators.required ],
    terminos: [false, Validators.required ],
  });

  constructor( private fb: FormBuilder) {}

  crearUsuario() {
    this.formSubmitted = true;
    console.log( this.registerForm.value );

    if(this.registerForm.valid) {
      console.log('posteando formulario')
    } else {
      console.log('Formulario no es correcto...');
    }
  }

  campoNoValido( campo: string ):boolean {

    if( this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }



}
