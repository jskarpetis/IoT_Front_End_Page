import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared.module';
import { CameraDetailsComponent } from './camere-details.component';
import { CameraDetailsRoutingModule } from './camera-details.routing';

@NgModule({
  declarations: [CameraDetailsComponent],
  imports: [CameraDetailsRoutingModule, SharedModule],
  providers: [],
  exports: [CameraDetailsComponent],
})
export class CameraDetailsModule {
  constructor() {}
}
