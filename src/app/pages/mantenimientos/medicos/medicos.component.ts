import { Component, OnDestroy, OnInit } from '@angular/core';

import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Medico } from 'src/app/models/medico.model';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarMedicos()
    });
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
    });
  }

  buscar( termino: string):any {

    if( termino.length === 0 ){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe( resp => {
        this.medicos = resp
      });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico.uid, medico.img);
  }
}
