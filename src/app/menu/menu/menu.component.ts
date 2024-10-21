import { Component, computed, effect, model, ModelSignal, output, Output } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { JsonPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAppComponent } from '../../bucket/modal-app/modal-app.component';
import { App } from '../../model/app';
import { InMemoryDataService } from '../../services/data.service';
import { AppsService } from '../../services/apps.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    DynamicDialogModule,
    ButtonModule,
    JsonPipe, 
  ],
  providers: [DialogService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  public dock_event: ModelSignal<boolean> = model(false);
  public add_app = output<App>();

  ref: DynamicDialogRef | undefined;
  
  constructor(
    public dialogService: DialogService,
    private menuService: MenuService,
    private inMemoryDataService: InMemoryDataService,
    private appsService: AppsService
  ){}

  callAddApp() {
    this.ref = this.dialogService.open(ModalAppComponent, { 
      header: 'Nueva aplicación',
      width: '50vw',
      modal:true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });

    this.ref.onClose.subscribe((app: App) => {         
      if(app){
        this.appsService.getApps().subscribe({
          next: (apps: any)=> {
              this.appsService.addApp({
                ...app,
                id: this.inMemoryDataService.genId(apps)
              }).subscribe({
                next: (app)=>{
                  this.add_app.emit(app);
                }
              })
            }
          })      
        }
    });
  }
 

  dockEvent(){    
    this.menuService.option_dock.set(!this.menuService.option_dock());
    this.dock_event.set(!this.dock_event())
  }
}
