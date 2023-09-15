import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || ';'
  }

  get headers() {
    return  {
      headers: {
        'x-token': this.token
      }
    }
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
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        localStorage.setItem('token', resp.token);
        return true;
      }),
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

  actualizarPerfil( data: { email:string, nombre:string, role: string | undefined } ) {
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });

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

  cargarUsuarios( desde: number = 0 ) {
    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>( url, this.headers );

  }



}
