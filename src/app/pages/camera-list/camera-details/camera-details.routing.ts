import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraDetailsComponent } from './camere-details.component';
const routes: Routes = [
  {
    path: '',
    component: CameraDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CameraDetailsRoutingModule {}
