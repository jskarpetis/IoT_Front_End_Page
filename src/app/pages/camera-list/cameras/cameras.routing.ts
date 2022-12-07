import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './cameras.component';
import { CameraDetailsComponent } from '../camera-details/camere-details.component';

const routes: Routes = [
  {
    path: '',
    component: CameraComponent,
  },
  {
    path: ':id',
    component: CameraDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CameraPageRoutingModule {}
