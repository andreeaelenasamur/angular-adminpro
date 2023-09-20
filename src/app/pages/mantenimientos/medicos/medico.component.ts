import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit{

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h.uid === hospitalId );
      })
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      })
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    this.medicoService.crearMedico( this.medicoForm.value )
      .subscribe( (resp: any) =>{
        console.log(resp);
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`dashboard/medico/${resp.medico.uid}`)
      })
  }


}
