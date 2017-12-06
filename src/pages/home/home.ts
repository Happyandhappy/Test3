import { Component } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';
import {SqliteProvider} from '../../providers/sqlite/sqlite';
import { ServerProvider} from '../../providers/server/server';
import { Toast } from '@ionic-native/toast';
import {SearchPage} from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public useData = {"email" : "" , "keyname" : "" , "datavalue" : "" , "status" : "" };
  public send_data : any[];
  public isConnected : boolean = false;
  public serverData : any[];
  public sendpreparedData : any[];
  
  constructor(public navCtrl : NavController
              ,public sqlite : SqliteProvider
              ,public server : ServerProvider
              ,public toast : Toast
              ,public platform: Platform)
            {
               this.send_data = new Array();
               this.serverData = new Array();
               this.sendpreparedData = new Array();
               platform.ready().then(res=>{});
               this.checkConnection();
            }

  // check the connection of server
  public checkConnection(){
      
    this.useData.status = "checkconnect";
      if (this.send_data.length>0) this.send_data.pop();
      this.send_data.push(this.useData);

      this.server.postData(this.send_data).then(res=>{
        if (this.isConnected==false && Object(res).status == 'success')
          {
            //if the connection is changed, get data from server
            this.sqlite.getAllDataFromDB("sendDataToServer").then(()=>{
                this.sendpreparedData = this.sqlite.arr1;
                console.log(this.sendpreparedData);
            },(err)=>{
                console.log("Error in reading data from DB");
            }); 
            this.sendpreparedDataToServer(this.sendpreparedData.length);
          }
        
        if (Object(res).status == 'success') this.isConnected = true;
        else this.isConnected = false;
        console.log("Server response is " + Object(res).status);
        setTimeout( () => {this.checkConnection();}, 9000);

      },err=>{
        this.isConnected = false;
        setTimeout( () => {this.checkConnection();}, 9000);
      });
  }

      
// get data from server and store to sqlite.
  public getServerData() {
    console.log("starting get data");
    this.useData.status = "getdata";
    if (this.send_data.length>0) this.send_data.pop();
    this.send_data.push(this.useData);
    this.server.getServerData(this.send_data).then((result) => {
      this.serverData = Object(result).data;
      this.sqlite.deleteAllDatainDB("getDataFromServer");
      //store to sqlite
      for (let i = 0 ; i < this.serverData.length ; i++)
        this.sqlite.addNewDataToDB(this.serverData[i].keyname,this.serverData[i].datavalue,"getDataFromServer");  

      console.log("Successfully get Data from server and store sqlite");
    }, (err) => {
      this.makeToast("No Network");
    });
  }

// send prepared data from sqlite to server
    sendpreparedDataToServer(count) {
      if (count > 0) {
        setTimeout(() => {
          this.sendToServer(this.sendpreparedData[count - 1].keyname,this.sendpreparedData[count-1].datavalue);
          count--;
          this.sendpreparedDataToServer(count);
        }, 1500);
      } 
      else 
          this.getServerData(); 
    }

  // When you click the Insert button, this func is called. 
  public insertNewData() {
     if (this.useData.keyname == null || this.useData.keyname == "" || this.useData.datavalue == null || this.useData.datavalue == "")
      {
       this.makeToast("New Data is Not Valid. Please try again");
      //  console.log("New Data is Not Valid. Please try again.");
     }
     else {
       this.makeToast("Enter success");
       console.log("SendDatatoServer " + this.isConnected);
      //  console.log(this.useData.keyname +  ":" + this.useData.datavalue);
       if (this.isConnected){
          console.log("starting sending");
          this.sendToServer(this.useData.keyname, this.useData.datavalue);  // send to server
       }
        this.saveUseDataToDB();        // store to sqlite db
     }

      // this.useData.keyname = "";
      // this.useData.datavalue = "";
  }

  // send new data to server
  public sendToServer(keyname, datavalue){
    if (this.send_data.length>0) this.send_data.pop();
      let  data = {"email" : "" , "keyname" : keyname , "datavalue" : datavalue , "status" : "addnewdata" };
      this.send_data.push(data);

      //Reset the input fields of html

      this.server.postData(this.send_data).then((result) => {
      
        if(Object(result).status == "fail"){
            console.log("Cannot save your data to server");
            this.makeToast("Cannot save your data to server");
        } else {
            console.log("Successfully send to server" + this.send_data);
            this.makeToast("Successfully send to server");
        }
      
      }, (err) => {
         this.makeToast("No Network");
         console.log("No Network");
      });
  }

  // store new data to sqlite db
  public saveUseDataToDB(){
      this.sqlite.addNewDataToDB(this.useData.keyname, this.useData.datavalue,"getDataFromServer").then(s => {
      //if server is offline, have to store data to sendDataToServer
        if (!this.isConnected) 
          this.sqlite.addNewDataToDB(this.useData.keyname, this.useData.datavalue,"sendDataToServer").then(s => {this.makeToast("Successfully Saved");
        },err=>{
          this.makeToast("I am sorry but there is a problem in your sendDataToServer Db");
        });
      }, err=>{
        this.makeToast("I am sorry but there is a problem in your getDataFromServer Db");
      });
  }
  
  //make toast message
  public makeToast(toastStr){
      this.toast.show(toastStr, '2000', 'bottom').subscribe(toast => {});
  }

 // turn current page to Search page
  public searchData(){
    this.navCtrl.push(SearchPage);
  }


  ionViewWillLeave(){
      
  }
}
