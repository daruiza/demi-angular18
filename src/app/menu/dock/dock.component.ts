import { Component, computed, effect, model, ModelSignal, OnInit, output } from '@angular/core';

import { DockModule } from 'primeng/dock';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { MenuService } from '../../services/menu.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAppComponent } from '../../bucket/modal-app/modal-app.component';
import { AppsService } from '../../services/apps.service';
import { InMemoryDataService } from '../../services/data.service';
import { App } from '../../model/app';

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [
    DockModule,
    ButtonModule
  ],
  providers:[DialogService],
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.css'
})
export class DockComponent implements OnInit {

  dock_option = computed(()=>this.menuService.option_dock());
  dock_event: ModelSignal<boolean> = model(false);

  selectedApp: ModelSignal<App|null> = model<App|null>(null);

  public add_app = output<App|null>();

  ref: DynamicDialogRef | undefined;

  public position = 'bottom';
  public items = [
    {
      label: 'Plus',
      icon: PrimeIcons.PLUS,
      command: () => this.callAddApp()
    },
    {
      label: 'Trash',
      icon: PrimeIcons.TRASH,
      command: () => this.deleteApp()

    },
    {
      label: 'Edit',
      icon: PrimeIcons.COG,
      command: () => this.callAddApp(this.selectedApp())
    },    
    {
      label: 'Bars',
      icon: PrimeIcons.BARS,
      command: () => this.menuService.option_menu.set(!this.menuService.option_menu())
    }
];

constructor(
  public dialogService: DialogService,
  private appsService: AppsService,
  private inMemoryDataService: InMemoryDataService,
  private menuService: MenuService){
  effect(()=>{
    // console.log('this.menuService.option_dock()', this.menuService.option_dock());    
    console.log('selectedApp', this.selectedApp());
    
  });
}

ngOnInit() {    
  
    
}

callAddApp(app:App|null = null) {
  this.ref = this.dialogService.open(ModalAppComponent, { 
    header: 'Nueva aplicación',
    width: '50vw',
    modal:true,
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    },
    data: {
      app: app
    },
  });

  this.ref.onClose.subscribe((app: App) => {
    if(app){
      this.appsService.getApps().subscribe({
        next: (apps: any)=> {
            if(app?.id){
              this.appsService.updateApp({
                ...app,
              }).subscribe({
                next: (res_app)=>{                  
                  this.add_app.emit(app);
                }
              });
            } else {
              this.appsService.addApp({
                ...app,
                id: this.inMemoryDataService.genId(apps)
              }).subscribe({
                next: (app)=>{
                  this.add_app.emit(app);
                }
              })
            }

          }
        })      
      }
  });
}

deleteApp(){
  this.appsService.deleteApp(this.selectedApp()).subscribe({
    next: (res)=>{
      // Retornamos una app para que se elimine de la tabla
      this.add_app.emit(this.selectedApp()); 
      this.selectedApp.set(null);
    }
  });
}

}
