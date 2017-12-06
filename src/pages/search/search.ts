import { Component } from '@angular/core';
import { NavController , Platform} from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import {ServerProvider} from '../../providers/server/server';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  curkeyname:string = "";
  datavalue :string = "";

  curData = [];

  constructor(public navCtrl: NavController,
              public sqlite:SqliteProvider,
              public server:ServerProvider,
              public platform:Platform,
              public toast:Toast) {
                this.platform.ready().then((res)=>{
                   sqlite.getAllDataFromDB("getDataFromServer").then(()=>{
                      this.curData = this.sqlite.arr;
                      console.log(this.curData);
                   },(err)=>{
                      console.log("Error in reading data from DB");
                   }); 
                });
  }

  public onInput(evt){
    console.log("inputing" + this.curkeyname);
     for (let i = 0;i<this.curData.length;i++){
        if (this.curkeyname == this.curData[i].keyname){
          console.log(this.curData[i].datavalue);
            this.curkeyname = this.curData[i].keyname;
            this.datavalue = this.curData[i].datavalue;
        }
     }
  }

}
