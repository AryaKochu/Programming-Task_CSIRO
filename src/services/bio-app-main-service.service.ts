import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BioAppMainServiceService {

  constructor( private http : Http) {
   }
       private baseUrl = "../assets/api/proteins_events_data.json";

  extractData(res:any) {
        let response = res.json();
        //console.log("response",response);
        return response;
      }
    // Fetch the job details
    fetchProteinEvents(): Observable<any> {
        // ...using get request
        return this.http.get(this.baseUrl)
            // ...and calling .json() on the response to return data
         .map(this.extractData)
            .catch(
            error => {
                 throw error ;
            });
    }
}
