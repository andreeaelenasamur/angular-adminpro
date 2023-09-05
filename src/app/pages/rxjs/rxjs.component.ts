import { Component } from '@angular/core';
import { Observable, retry, interval, take, map } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent {

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error', error),
    //   () => console.info('Obs terminado')
    // );

    this.retornaIntervalo()
      .subscribe(console.log)

  }

  retornaIntervalo(): Observable<number> {

    return interval(1000)
            .pipe(
              take(4),
              map( valor => valor + 1)
            );
  }

  retornaObservable(): Observable<number> {

    let i = -1;

    return new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;
        observer.next(i);

        if(i === 4){
          clearInterval(intervalo);
          observer.complete();
        }

        if( i === 2 ) {
          observer.error('i llego al valor de 2')
        }
      }, 1000)
    });

  }



}
