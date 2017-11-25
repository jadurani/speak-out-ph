import { Component } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';

import { SMS } from '@ionic-native/sms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // contactsList = [1,2,3,4,5,6];
  contactsList = [{
    url:'https://1.bp.blogspot.com/-Tg_1__E2p08/V4Ug1iPjr_I/AAAAAAAACC0/MuoP9ZSpcsU3ZeoJ7Xx65OUTwVEYfReMwCK4B/s1600/best%2Bavatar%2Bimage.jpg',
    displayName: 'Jadurani Davalos',
    phoneNumber: '09088679753'
  }];

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private smsVar: SMS
  ) {

  }

  sendSMSToContacts(text: string) {
    let message = text + ' (sent via SpeakOutPH)';
    let options = {
      replaceLineBrakes: false,
      android: {
        intent: ''
      }
    };

    this.contactsList.forEach(contactPerson => {
      this.smsVar.send(
        contactPerson.phoneNumber,
        message,
        options
      ).then(() => {
        alert('success');
      }, () => {
        alert('failed');
      });
    });
  }

  showConfirmModal(text: string) {
    let confirm = this.alertCtrl.create({
      message: `Send SMS message "${text}" to your emergency contacts?`,
      buttons: [
        {
          text: 'YES',
          handler: () => {
            this.sendSMSToContacts(text);
          }
        },
        {
          text: 'no',
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  presentActionSheet() {
    let textMessages = [
      'Please come get me',
      'Call me, I need an interruption',
      'I need to talk'
    ];

    let buttonObjArray = [];
    textMessages.forEach(textMessage => {
      buttonObjArray.push({
        text: textMessage,
        handler: () => {
          this.showConfirmModal(textMessage);
        }
      });
    });

    buttonObjArray.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {}
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select message to send',
      buttons: buttonObjArray
    });

    actionSheet.present();
  }

  meow() {
    console.log('meow');
  }
}
