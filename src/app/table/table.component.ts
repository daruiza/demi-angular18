import { Component, computed, effect, input, model, ModelSignal, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { AppsService } from '../services/apps.service';
import { App } from '../model/app';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAppComponent } from '../bucket/modal-app/modal-app.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, ButtonModule, MenuModule, ConfirmPopupModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, OnChanges {

  apps = signal<App[]>([])
  selectedApps = signal<App|null>(null);
  selectedApp: ModelSignal<App|null> = model<App|null>(null);

  add_app = input();
  add_app_model: ModelSignal<App | null> = model<App | null>(null);
  add_app_signal = input<App | null>(null);
  add_app_computed = computed(()=> {    
    if(this.add_app_signal()) {
      this.getApps();  
    }    
    return this.add_app_signal();
  })  

  items = [
    {
        label: 'Options',
        items: [
            {
                label: 'Editar',
                icon: 'pi pi-cog',
                command:() => this.callAddApp()
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command:() => this.confirm2()
            }
        ]
      }
  ];

  ref: DynamicDialogRef | undefined;

  constructor(
    private appsService: AppsService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService
  ){

    effect(()=> {
      // console.log('apps', this.apps());
      // console.log('add_app_model', this.add_app_model());

      // realiza el llamado al computed, es una suscriapción reactiva ente cambios
      this.add_app_computed();
      
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes', changes);
    if(changes['add_app'] && !changes['add_app'].firstChange){
      // this.getApps();
    }    
  }

  ngOnInit(): void {
    this.getApps();  
  }

  getApps(){
    this.appsService.getApps().subscribe({
      next: (apps)=>{
        this.apps.set(apps);

        // se puede usar ante el borrado, pero para el borrado es mejor hace un flujo extra
        // this.selectedApp.set(null);      
      }
    })
  }

  onRowSelect(event:any) {
    // console.log('this.selectedApps',this.selectedApps()); 
    this.selectedApp.set(this.selectedApps());
  }  

  callAddApp() {
    this.ref = this.dialogService.open(ModalAppComponent, { 
      header: 'Editar '+this.selectedApp()?.name,
      width: '50vw',
      modal:true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        app: this.selectedApp()
      },
    });

    this.ref.onClose.subscribe((app: App) => {  
      if(app){
        this.appsService.updateApp({
          ...app,
        }).subscribe({
          next: (app)=>{
            this.getApps()
          }
        });
      }    
    });
  }

  deleteApp(){
    this.appsService.deleteApp(this.selectedApp()).subscribe({
      next: (res)=>{
        this.selectedApp.set(null);
        this.getApps();        
      }
    });
  }

  confirm2() {
    this.confirmationService.confirm({
        // target: event.target as EventTarget,
        message: 'Do you want to delete this record: '+this.selectedApp()?.name,
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
        accept: () => this.deleteApp(),
        reject: () => {}
    });
  }
}
