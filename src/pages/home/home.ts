import { Component } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';

import { SMS } from '@ionic-native/sms';
import { ContactsListProvider } from '../../providers/contacts-list/contacts-list';

import {NgZone} from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ContactsListProvider]
})
export class HomePage {

  contactsList = [];

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public contactsService: ContactsListProvider,
    private smsVar: SMS,
  ) {
    this.loadFromFactory();
  }

  loadFromFactory() {
    this.contactsService.getEmergencyContacts()
      .then((contactsListString) => {
        this.contactsList = JSON.parse(contactsListString) || [];
        const dummyList = this.contactsService
        .getDummyEmergencyContactsList(this.contactsList.length);
        this.contactsList = [...this.contactsList, ...dummyList];
      }).catch((err) => {
        this._showAlert(
          'Relaunch App',
          'There were problems launching the app. Kindly reload, thanks.');
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
          this._showAlert('Success', 'Message sent!');
        }).catch(err => {
          this._showAlert('Failed', 'Send failed.');
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

  insertToList(contactItem, contactIndex) {
    // this.contactsList.push(contactItem);
    this.contactsList = [
      ...this.contactsList.slice(0, contactIndex),
      contactItem,
      ...this.contactsList.slice(contactIndex + 1, this.contactsList.length),
    ]
  }

  selectNewContact(contactIndex) {
    this.contactsService.selectNewEmergencyContact(contactIndex)
      .then((contactItem) => {
        this.insertToList(contactItem, contactIndex);
      })
      .catch((err) => {
        this._showAlert('Invalid Contact', 'Make sure your contact has a valid phone number')
      });
  }

  _showAlert(alertTitle, alertMessage) {
    let alert = this.alertCtrl.create({
      title: alertTitle,
      subTitle: alertMessage,
      buttons: ['OK']
    });
    alert.present();
  }
}
