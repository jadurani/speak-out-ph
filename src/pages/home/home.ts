import { Component } from '@angular/core';
import {
  NavController,
  ActionSheetController
} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController
  ) {

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select message',
      buttons: [
        {
          text: 'Blah 1',
          handler: () => {
            console.log('Destructive clicked');
          }
        }, {
          text: 'Blah 2',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
