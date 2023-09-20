import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit{

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService
    ) {}

  ngOnInit(): void {
    this.medicoForm = this.fb.group({
      nombre: ['Hernando', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        console.log(hospitales)
        this.hospitales = hospitales;
      })
  }

  guardarMedico() {
    console.log(this.medicoForm.value)
  }


}
