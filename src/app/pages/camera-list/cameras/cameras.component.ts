import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators';
import { GetCamerasResponse } from '../../../../eshopAPI/models/GetCamerasResponse';
import { Values } from '../../../../eshopAPI/settings';
import { GlobalsService } from '../../../../services/globals.service';
import { BaseComponent } from '../../../../shared/base.component';
import { CamerasPresenter } from '../cameras.presenter';

@Component({
  templateUrl: './cameras.component.html',
  providers: [CamerasPresenter],
})
export class CameraComponent extends BaseComponent implements OnInit {
  private _cameras: any[] = [];
  private _listFilter = '';

  filteredCameras: any[] = [];

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCameras = this.listFilter
      ? this.performFilter(this.listFilter)
      : this.cameras;
  }

  set cameras(value: any[]) {
    this._cameras = value;
  }

  get cameras() {
    return this._cameras;
  }

  constructor(
    public presenter: CamerasPresenter,
    public router: Router,
    public globalService: GlobalsService
  ) {
    super(presenter, router);
  }

  ngOnInit(): void {
    this.presenter.getCamerasObserver$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.allCameras(value);
      });

    this.getAllCameras();
  }

  ngOnChange() {
    this.getAllCameras();
  }

  getAllCameras() {
    this.presenter.getCameras();
  }

  async allCameras(response: any) {
    console.log(response);
    this.cameras = response.body.allCameraData;
    this.listFilter = '';
  }

  performFilter(filterBy: string): any[] {
    return this.cameras.filter(
      (camera: any) => camera.camera_id.indexOf(filterBy) !== -1
    );
  }

  EditCamera(camera_id: string) {
    this.globalService.id = camera_id;
    this.router.navigateByUrl(`/cameras/?id=${camera_id}`);
  }
}
