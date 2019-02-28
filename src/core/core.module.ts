import { NgModule } from '@angular/core';

import { ApiProvider } from '../core/api/api';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';


import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

//services

import { MainService } from './services/main.service';


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
    ReactiveFormsModule
  ],
  declarations: [],
  providers: [
    ApiProvider,
    SpinnerDialog,
    MainService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
    FileTransfer,
    FileTransferObject,
    
    //DocumentViewer,
    
  ]
})
export class CoreModule {

}