import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { App } from '../model/app';


@Injectable({
  providedIn: 'root'
})
export class AppsService {

	private appsURL = 'api/apps';  // URL to web api
	private statusURL = 'api/status';  // URL to web status
	private technologyUrl = 'api/technology';  // URL to web technology	
	
	httpOptions = {
	  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

  	constructor(private http: HttpClient) { }
	
  	getApps(): Observable<App[]> {
		return this.http.get<App[]>(this.appsURL)
    		.pipe(
      			tap(_ => this.log('fetched apps')),
      			catchError(this.handleError<App[]>('getApps', []))
    		);
	}

	getApp(id: number): Observable<App> {		
	  	const url = `${this.appsURL}/${id}`;
	  	return this.http.get<App>(url).pipe(
	    	tap(_ => this.log(`fetched app id=${id}`)),
	    	catchError(this.handleError<App>(`getApp id=${id}`))
	  	);
	}

	updateApp(app: App): Observable<any> {
	  return this.http.put(this.appsURL, app, this.httpOptions).pipe(
	    tap(_ => this.log(`updated app id=${app.id}`)),
	    catchError(this.handleError<any>('updateApp'))
	  );
	}

	addApp(app: App): Observable<App> {
	  return this.http.post<App>(this.appsURL, app, this.httpOptions).pipe(
	    tap((newApp: App) => this.log(`added app id=${newApp.id}`)),
	    catchError(this.handleError<App>('addApp'))
	  );
	}

	searchApps(term: string): Observable<App[]> {
	  if (!term.trim()) {
	    // if not search term, return empty hero array.
	    return of([]);
	  }
	  return this.http.get<App[]>(`${this.appsURL}/?name=${term}`).pipe(
	    tap(_ => this.log(`found app matching "${term}"`)),
	    catchError(this.handleError<App[]>('searchApp', []))
	  );
	}

	deleteApp (app: App | null ): Observable<App | number> {
	  const id = app ? app?.id : null;
	  const url = `${this.appsURL}/${id}`;

	  return this.http.delete<App>(url, this.httpOptions).pipe(
	    tap(_ => this.log(`deleted app id=${id}`)),
	    catchError(this.handleError<App>('deleteApp'))
	  );
	}

	getStatus(): Observable<App[]> {
		return this.http.get<App[]>(this.statusURL)
    		.pipe(
      			tap(_ => this.log('fetched status')),
      			catchError(this.handleError<App[]>('getStatus', []))
    		);
	}

	getTechnology(): Observable<App[]> {
		return this.http.get<App[]>(this.technologyUrl)
    		.pipe(
      			tap(_ => this.log('fetched technology')),
      			catchError(this.handleError<App[]>('getTechnology', []))
    		);
	}
	

	private log(message: string) {
	//   console.log(`AppService: ${message}`);
	}
	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
	 
	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	 
	    // TODO: better job of transforming error for user consumption
	    this.log(`${operation} failed: ${error.message}`);
	 
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}	
}