import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,MenuController } from 'ionic-angular';

/**
 * Generated class for the ProfileeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profileedit',
  templateUrl: 'profileedit.html',
})
export class ProfileeditPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events1: Events,
    public menuCtrl: MenuController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileeditPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
  }

}
