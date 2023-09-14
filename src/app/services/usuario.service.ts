import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const google: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router
    ) {
      this.googleInit()
     }

  googleInit() {

    return new Promise<void>( resolve => {
      console.log('google init')

      google.accounts.id.initialize({
        client_id:
          "925612984899-clbj00s5h37d6gvo8vg9o0di9fm8vr0g.apps.googleusercontent.com",
      });

      resolve();
    });


  }

  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('andelenasamur@gmail.com', () => {
      this.router.navigateByUrl('/login');
    })
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        const { email, google, nombre, role, img, uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        localStorage.setItem('token', resp.token);
      }),
      map( resp => true ),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  loginGoogle( token: string ) {
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap( (resp: any) => {
          // console.log(resp)
          localStorage.setItem('token', resp.token)
        })
      )
  }




}
