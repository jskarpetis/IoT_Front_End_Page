import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared.module';
import { CameraDetailsComponent } from './camere-details.component';
import { CameraDetailsRoutingModule } from './camera-details.routing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../../../components/graph.component';

@NgModule({
  declarations: [CameraDetailsComponent, GraphComponent],
  imports: [
    CameraDetailsRoutingModule,
    SharedModule,
    BrowserModule,
    CommonModule,
  ],
  providers: [],
  exports: [CameraDetailsComponent],
})
export class CameraDetailsModule {
  constructor() {}
}
