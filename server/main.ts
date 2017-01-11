import { Meteor } from 'meteor/meteor';

import { loadParties } from './imports/fixtures/parties';

import './imports/publications/parties';
import './imports/publications/users';
import '../both/methods/parties.methods';
import './imports/publications/images';

Meteor.startup(() => {

  process.env.MAIL_URL = 'smtp://smtp.ca.aero.bombardier.net';
  
  loadParties();
});
