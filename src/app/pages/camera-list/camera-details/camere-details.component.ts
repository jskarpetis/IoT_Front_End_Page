import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators';

import { GlobalsService } from '../../../../services/globals.service';
import { BaseComponent } from '../../../../shared/base.component';
import { CamerasPresenter } from '../cameras.presenter';
@Component({
  templateUrl: './camera-details.component.html',
  providers: [CamerasPresenter],
})
export class CameraDetailsComponent extends BaseComponent implements OnInit {
  pageTitle = 'Camera Details';
  _camera: any[] = [];
  errorMessage: string = 'Default';

  set camera(camera: any) {
    this._camera = camera;
  }

  get camera() {
    return this._camera;
  }

  constructor(
    public presenter: CamerasPresenter,
    public router: Router,
    public globalService: GlobalsService
  ) {
    super(presenter, router);
  }

  ngOnInit(): void {
    this.presenter.getCameraByIdObserver$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.IdCamera(value);
      });
    this.getCameraById();
  }
  Back() {
    this.router.navigateByUrl('/cameras');
  }
  getCameraById() {
    this.presenter.getCameraById(this.globalService.id);
  }

  async IdCamera(response) {
    console.log(response);
    this.camera = response.body.cameraData.reverse();
    console.log(this.camera);
  }
}
