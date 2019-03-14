import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ApiProvider } from '../core/api/api';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';


import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {FooterPage} from '../pages/include/footer/footer';
//services

import { UserService } from './services/user.service';
import { WoocommerceService } from './services/woocommerce.service';
import { CategoryService } from './services/category.service';




@NgModule({
  imports: [
    // Ionic2RatingModule 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ionicGalleryModal.GalleryModalModule,
  ],
  exports: [
    // Ionic2RatingModule 
    FormsModule,
    ReactiveFormsModule,
    FooterPage
  ],
  declarations: [
    //FooterPage
    FooterPage
  ],
  providers: [
    ApiProvider,
    SpinnerDialog,
    UserService,
    WoocommerceService,
    CategoryService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
    FileTransfer,
    FileTransferObject,
    
    //DocumentViewer,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {

}