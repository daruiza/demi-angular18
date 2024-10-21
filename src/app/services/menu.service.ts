import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public option_menu = signal(true);
  public option_dock = signal(false);
  constructor() { }

}
