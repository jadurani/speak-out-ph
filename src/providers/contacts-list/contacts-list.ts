import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contacts } from '@ionic-native/contacts';
import { DomSanitizer } from '@angular/platform-browser';

/*
* Class that communicates with the local database (Storage).
* Also communicates with the native contacts app.
* We only need 6 contacts to store as active
* However, we may want to keep logs in the future
* for easier integration with the web app, e.g.,
* A user sent a cry for help during X time.  When user's already
* in a safe place and already has internet connection, we may want
* ask them about the past cry for help, and if they'd like to
* submit a report about it.
Storage: {<KEY>:<VALUE>}
Where <VALUE> is [<CONTACT>, <CONTACT>, ..., <CONTACT>]
and <CONTACT> is
  {
    'id': int,
    'rawId': int,
    'displayName': string,
    'phoneNumber': string,
    'photoUrl': string,
  }
*/
@Injectable()
export class ContactsListProvider {
  DB_KEY: string = 'MY_EMERGENCY_CONTACTS';

  constructor(
    private storage: Storage,
    private nativeContactsService: Contacts,
    private sanitizer: DomSanitizer
  ) {
  }

  /**
   * Resets our DB Record.  Happens every update
   */
  resetContactsRecord(contactsListArray) {
    let contactsListString = JSON.stringify(contactsListArray);

    return this.storage.remove(this.DB_KEY).then(() => {
      this.storage.set(this.DB_KEY, contactsListString).then(() => {
        // alert(`stored!: ${contactsListString}`);
        Promise.resolve(contactsListArray);
      }).catch(err => {
        // alert(`Error in updating list: ${err}`);
        Promise.reject({ 'status': 'FAIL' });
      });
    });
  }

  getDummyEmergencyContactsList(nonDummyListLength) {
    let dummyInfo = {
      'id': -1,
      'rawId': 0,
      'displayName': 'Select a contact',
      'phoneNumber': '',
      'photoUrl': '',
    };

    let dummyList = [];
    let dummyListLength = 6 - nonDummyListLength;
    for (let count = 0; count < dummyListLength; count++) {
      dummyList.push(dummyInfo);
    }
    return dummyList;
  }

  /**
   * Returns a Promise to get the contacts list or nothing.
   * On success, it returns the stringified array of emergency contacts
   * On failure, alerts user and returns null.
   */
  getEmergencyContacts() {
    return this.storage.get(this.DB_KEY);
  }

  /**
   * Called by selectNewEmergencyContact
   * Attempts to save the selected contact
   * @param selectedContact: any
   */
  saveAsEmergencyContact(selectedContact, contactIndex = 0) {
    // TO DO: Check for valid phone numbers
    let contactToStore = {
      'id': contactIndex,
      'rawId': selectedContact.id,
      'displayName': selectedContact.displayName,
      'phoneNumber': selectedContact.phoneNumbers[0].value,
      'photoUrl': 'https://mediaassets.wkbw.com/photo/2017/10/17/CAT%20PIC_1508223570861_68991041_ver1.0_640_480.jpeg'
    };

    // if (selectedContact.photos) {
    //   contactToStore.photoUrl = this.sanitizer.bypassSecurityTrustUrl(selectedContact.photos[0].value) as string;
    //   alert(contactToStore.photoUrl);
    // }

    return this.storage.get(this.DB_KEY).then((contactsListString) => {
      let contactsListArray = JSON.parse(contactsListString);
      if (!contactsListArray) {
        contactsListArray = [];
      } else if (contactIndex < 0) {
        // add new instead of replace
        contactToStore.id = contactsListArray.length;
      }
      contactsListArray.push(contactToStore);

      // return this.resetContactsRecord(contactsListArray);
      this.resetContactsRecord(contactsListArray);
      return contactToStore;
    }).catch(err => {
      alert(`Error in fetching list: ${err}`);
    });
  }

  /**
   * Called by sendHelp/home page.
   * Calls the native contacts app and lets user
   * select from their list of contacts
   * Alerts user on error.
   *
   * TO DO
   * Check what happens if user just clicks on back,
   * Would that throw an error too?
   */
  selectNewEmergencyContact(contactIndex) {
    return this.nativeContactsService.pickContact().then(
      (selectedContact) => {
        let contactToStore = this.saveAsEmergencyContact(selectedContact, contactIndex);
        return contactToStore;
      }).catch((error) => {
        return Promise.reject(`error: ${error}`);
      });
  }
}
