import { Component, computed, effect, model, ModelSignal, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DockModule } from 'primeng/dock';
import { ButtonModule } from 'primeng/button';
import { DockComponent } from "./menu/dock/dock.component";
import { MenuComponent } from "./menu/menu/menu.component";
import { MenuService } from './services/menu.service';
import { TableComponent } from "./table/table.component";
import { App } from './model/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DockModule,
    ButtonModule,
    DockComponent,
    MenuComponent,
    TableComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',  
})
export class AppComponent {  

  option_menu = computed(()=>this.menuService.option_menu());
  col_span = computed(()=>this.menuService.option_menu()?'col-span-9':'col-span-12');

  dock_event: ModelSignal<boolean> = model(false);
  selectedApp: ModelSignal<App|null> = model<App|null>(null);
  
  add_app: App | null = null;
  add_app_model: ModelSignal<App | null> = model<App | null>(null);
  add_app_signal = signal<App | null>(null);
  
  constructor(private menuService: MenuService){

    effect(()=>{
      // console.log(this.option_menu());
      // console.log(this.menuService.option_menu());      
    })

  }

  addApp(app: App|null) {    
    this.add_app = app;
    this.add_app_model.set(app);
    this.add_app_signal.set(app);
  }
  
}
