import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiurl:string = "http://192.168.2.138/apiserver/";

@Injectable()
export class ServerProvider {
  constructor(public http: Http) {
  }


   postData(credentials) {
    // console.log(credentials);
    return new Promise((resolve, reject) => {       

      this.http.post(apiurl, credentials).subscribe(res => {
        console.log("response: "+res);
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
      
    });
  }


  getServerData(credentials){
    return new Promise((resolve, reject)=>{
      this.http.post(apiurl, credentials).subscribe(res=>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });
    });
  }

  sendImageData(credentials){
    return new Promise((resolve,reject)=>{
      this.http.post(apiurl,credentials).subscribe(
        res=>{
          resolve(res.json());
        },
        (err)=>{
          resolve(err);
        });
    });
  }
}
