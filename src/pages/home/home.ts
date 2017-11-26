import { Component } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';

import { SMS } from '@ionic-native/sms';
import { ContactsListProvider } from '../../providers/contacts-list/contacts-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ContactsListProvider]
})
export class HomePage {

  contactsList = [];
  dummyList = [];

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public contactsService: ContactsListProvider,
    private smsVar: SMS
  ) {
    this.loadFromFactory();
  }

  loadFromFactory() {
    this.contactsService.getEmergencyContacts()
      .then((contactsListString) => {
        this.contactsList = JSON.parse(contactsListString) || [];
        this.dummyList = this.contactsService
          .getDummyEmergencyContactsList(this.contactsList.length);
      }).catch((err) => {
        alert(err);
      });
  }

  sendSMSToContacts(text: string) {
    let message = text + ' (sent via SpeakOutPH)';
    let options = {
      replaceLineBrakes: false,
      android: {
        intent: ''
      }
    };

    if (this.contactsList && this.contactsList.length) {
      this.contactsList.forEach(contactPerson => {
        this.smsVar.send(
          contactPerson.phoneNumber,
          message,
          options
        ).then(() => {
          alert('success');
        }).catch(err => {
          alert('failed');
        });
      });
    }

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

    if (this.contactsList && this.contactsList.length) {
      actionSheet.present();
    }
  }

  selectNewContact(contactIndex) {
    this.contactsService.selectNewEmergencyContact(contactIndex)
      .then(() => {})
      .catch((err) => alert(err));
  }
}
