import { Component } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {

  progreso: number = 40;

  get getPorcentaje() {
    return `${this.progreso}%`;
  }

  cambiarValor( valor: number ) {

    if( this.progreso >= 100 && valor >= 0 ){
      this.progreso = 100;
      return;
    }


    if( this.progreso <= 0 && valor < 0 ){
      this.progreso = 0;
      return;
    }

    this.progreso = this.progreso + valor;

  }

}
