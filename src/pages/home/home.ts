import { Component } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {

  }

  showConfirmModal(text: string) {
    let confirm = this.alertCtrl.create({
      message: 'send sms message?',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            console.log('Agree clicked');
          }
        },
        {
          text: 'no',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select message',
      buttons: [
        {
          text: 'Please come get me',
          handler: () => {
            console.log('Destructive clicked');
            this.showConfirmModal('Please come get me');
          }
        }, {
          text: `Currently being bothered by someone, call me, I need an interruption`,
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: `I need to talk`,
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

  meow() {
    console.log('rawr');
  }

}
