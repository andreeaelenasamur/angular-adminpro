import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public hospitales: Hospital[] = [];
  // public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarHospitales()
    });
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
    .subscribe( hospitales => {
      this.hospitales = hospitales;
      // this.hospitalesTemp = hospitales;
      this.cargando = false;
    })

  }

  guardarCambios( hospital: Hospital ) {

    this.hospitalService.actualizarHospital(hospital.uid, hospital.nombre)
      .subscribe( resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      })
  }

  eliminarHospital( hospital: Hospital ) {

    this.hospitalService.borrarHospital(hospital.uid)
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })

    if( value.trim().length > 0 ) {
      this.hospitalService.crearHospital(value)
        .subscribe( (resp: any) => {
          this.hospitales.push(resp.hospital)
        })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital.uid, hospital.img);
  }

  buscar( termino: string):any {

    if( termino.length === 0 ){
      return this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe( resp =>
        this.hospitales = resp
      );
  }


}
