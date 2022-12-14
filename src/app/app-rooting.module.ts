import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/init/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'cameras',
    loadChildren: () =>
      import('./pages/camera-list/cameras/cameras.module').then(
        (m) => m.CameraModule
      ),
  },
  {
    path: 'cameras/:id',
    loadChildren: () =>
      import('./pages/camera-list/camera-details/camera-details.module').then(
        (m) => m.CameraDetailsModule
      ),
  },
];

// This module is used to group some of our routes to a different module in order to keep everything a bit clearer
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRootingModule {}
