import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

	createDb() {
	    const apps = [
	      { id: 11,	date_born:'04/03/1991',	name:'APPX23',		developer: 'Raigoza', 		date_hire:'05/23/2013',	status:'Producción',	technology:'python' },      
	      { id: 12,	date_born:'04/03/1986',	name:'APP CODEX', 	developer: 'Pedra', 		date_hire:'04/03/2014',	status:'Producción',	technology:'php' },
	      { id: 13,	date_born:'04/12/1989',	name:'APP AMAPRO', 	developer: 'Sandro', 		date_hire:'11/26/2016',	status:'Producción',	technology:'java' },
	      { id: 14,	date_born:'02/21/1981',	name:'APP YOURNAL', developer: 'Camilo Pablo', 	date_hire:'11/26/2011',	status:'Producción',	technology:'javascript' },
	      { id: 15,	date_born:'04/12/1984',	name:'APPX21', 		developer: 'Martha Rosa', 	date_hire:'11/26/2016',	status:'Producción',	technology:'html' },
	      { id: 16,	date_born:'04/08/1985',	name:'APPXYZ', 		developer: 'Harol Pepe', 	date_hire:'10/21/2017',	status:'Producción',	technology:'css' },	     
	    ];
		
		const status = [
			{ id: 1, name: 'Analisis'},
			{ id: 2, name: 'Desarrollo'},      
			{ id: 3, name: 'Pruebas'},      
			{ id: 4, name: 'Producción'},
			{ id: 5, name: 'Caida'},            
		];

		const technology = [
			{ id: 1, name: 'php'},
			{ id: 2, name: 'python'},      
			{ id: 3, name: 'java'},      
			{ id: 4, name: 'javascript'},
			{ id: 5, name: 'html'},            
			{ id: 6, name: 'css'},            
			{ id: 7, name: 'dart'},            
			{ id: 7, name: '.net'},            
		];

	    return {apps, status, technology};
  	}

  	/*to generate a new id*/
  	genId(apps: any[]): number {
		return apps.length > 0 ? Math.max(...apps.map(apps => apps?.id)) + 1 : 11;
	}
}