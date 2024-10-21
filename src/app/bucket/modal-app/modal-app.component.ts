import { Component, input, InputSignal, OnInit } from '@angular/core';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';


import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppsService } from '../../services/apps.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { App } from '../../model/app';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modal-app',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-app.component.html',
  styleUrl: './modal-app.component.css'
})

export class ModalAppComponent implements OnInit {

  public app: any = input(null);

  public appForm!: FormGroup;
  public appFormOld!: any;

  public status_list!: any[];
  public technology_list!: any[];

  constructor(
    private appsService: AppsService,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ){

  }

  ngOnInit(): void {
    this.app = this.config?.data?.app??null;   
    this.formConstructor().then(()=> {
      this.callServices().then(()=> {
        if(this.app){
          this.appForm.patchValue({ 
            id: this.app.id,
            general: {name: this.app.name, developer: this.app.developer},
            dates: {date_born: new Date(this.app.date_born), date_hire: new Date(this.app.date_hire)},
            aditional: {status: this.status_list.find(el=>el.name===this.app.status), technology: this.technology_list.find(el=>el.name===this.app.technology)}
          }, { emitEvent: false });
        }
        this.appFormOld = { ...this.appForm.value }        
      })
    });
  }

  async callServices() {
    await new Promise((resolve) => {
      forkJoin([this.appsService.getStatus(),this.appsService.getTechnology()]).subscribe({
        next:([status_list, technology_list]) => {
          this.status_list = status_list;
          this.technology_list = technology_list;
          resolve(null);
        }
      });
    });
  }
  
  async formConstructor() {
    await new Promise((resolve) => {
      
      this.appForm = new FormGroup({
        id: new FormControl(),
        general: new FormGroup({
          name: new FormControl(null, [Validators.required]),
          developer: new FormControl(null, [Validators.required]),
        }),
        dates: new FormGroup({
          date_born: new FormControl(null, [Validators.required]),
          date_hire: new FormControl(null, [Validators.required]),
        }),
        aditional: new FormGroup({
          status: new FormControl(null, [Validators.required]),
          technology: new FormControl(null, [Validators.required])
        })
      });

      resolve(null);

    })
  }

  saveApp() {
    if(this.appForm.valid){
      this.ref.close({
        id:this.appForm.value.id,
        name: this.appForm.value.general.name,
        developer: this.appForm.value.general.developer,
        date_born: new Date(this.appForm.value.dates.date_born).toLocaleDateString(), 
        date_hire: new Date(this.appForm.value.dates.date_hire).toLocaleDateString(),
        status: this.appForm.value.aditional.status.name,
        technology: this.appForm.value.aditional.technology.name,      
      });
    }
  }

}
