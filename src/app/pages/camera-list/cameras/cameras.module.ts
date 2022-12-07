import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared.module';
import { CameraComponent } from './cameras.component';
import { CameraPageRoutingModule } from './cameras.routing';

@NgModule({
  declarations: [CameraComponent],
  imports: [CameraPageRoutingModule, SharedModule],
  providers: [],
  exports: [CameraComponent],
})
export class CameraModule {
  constructor() {}
}
