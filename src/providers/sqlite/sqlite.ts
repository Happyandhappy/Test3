import { Injectable } from '@angular/core';

/*
  Generated class for the SqliteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var window : any;
@Injectable()
export class SqliteProvider {
  public text : string = "";
  public db = null;
  public arr :any[];
  public arr1:any[];
  public isconnect:boolean = true;
  constructor() {}

  //Initialize of Sqlite DB
  public openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'todo.db', location: 'default'});
    this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS getDataFromServer (id integer primary key,keyname text, datavalue text)');
      }, (e) => {
        console.log('Transtion Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      });


      this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS sendDataToServer (id integer primary key,keyname text, datavalue text)');
      }, (e) => {
        console.log('Transtion Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      });

  }


  public addNewDataToDB(keyname,datavalue,dbname) {
    return new Promise(resolve => {
      this.isExistedinDB(keyname,dbname).
        then((res)=>{
          
          if (res==false){
            var InsertQuery = "INSERT INTO " + dbname + " (keyname, datavalue) VALUES (?,?)";
                  this
                    .db
                    .executeSql(InsertQuery, [keyname, datavalue], (r) => {
                      console.log('Inserted... Sucess..', keyname);
                      resolve(true)
                    }, e => {
                      console.log('Inserted Error', e);
                      resolve(false);
                    })
          } else{
            this.updateOneDatainDB(keyname,datavalue,dbname).then(res=>{
              resolve(true)
            },err=>{
              resolve(false)
            }) 
          }
        },(reject)=>{
            console.log(reject + ":" + dbname);
        });
    });
  }

  public getAllDataFromDB(dbname) {
    return new Promise(res => {
      this.arr = [];
      this.arr1 = [];
      let query = "SELECT * FROM " + dbname;
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
                if (dbname == "getDataFromServer")
                  this.arr.push({ keyname:rs.rows.item(i).keyname, datavalue: rs.rows.item(i).datavalue});
                else{
                  this.arr1.push({ keyname:rs.rows.item(i).keyname, datavalue: rs.rows.item(i).datavalue});
                  console.log("sendDatatoServer " + this.arr1);
                }
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  public isExistedinDB(keyname,dbname) {
    return new Promise(res => {
      let query = "SELECT * FROM " + dbname + " where keyname=?";
      this
        .db
        .executeSql(query, [keyname], rs => {
          if (rs.rows.length>0) res(true);
          else res(false)
        }, (e) => {
          // console.log('Sql Query Error', e);
          res(false)
        });
    })
  }


  public deleteDatainDB(keyname,dbname) {
    return new Promise(resolve => {
      var query = "DELETE FROM " + dbname + " WHERE keyname=?";
      this
        .db
        .executeSql(query, [keyname], (s) => {
          // console.log('Delete Success...', s);
          this
            .getAllDataFromDB(dbname)
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          // console.log('Deleting Error', err);
        });
    })
  }

  //Clear data of table
  public deleteAllDatainDB(dbname){
      return new Promise(resolve=>{
         var query = "DELETE FROM " + dbname;
         this
         .db
         .executeSql(query,(s)=>{
           resolve(true);
         }, 
          (err)=>{
           resolve(false);
         }); 
      });
  }

  //Update data in the DB
  public updateOneDatainDB(keyname, datavalue, dbname) {
    return new Promise(res => {
      var query = "UPDATE " + dbname + " SET datavalue=?  WHERE keyname=?";
      this
        .db
        .executeSql(query, [
          keyname,datavalue 
        ], (s) => {
          // console.log('Update Success...', s);
          this
            .getAllDataFromDB(dbname)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
  }
}
