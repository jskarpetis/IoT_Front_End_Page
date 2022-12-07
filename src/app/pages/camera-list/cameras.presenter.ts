import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CameraService } from '../../../services/cameras.service';
import { BasePresenter } from '../../../shared/base.presenter';

@Injectable({
  providedIn: 'root',
})
export class CamerasPresenter extends BasePresenter {
  private getCamerasObserver: Subject<boolean> = new Subject();
  private getCameraByIdObserver: Subject<boolean> = new Subject();

  constructor(private camerasService: CameraService) {
    super();
  }

  getCamerasObserver$: Observable<any> = this.getCamerasObserver.pipe();
  getCameraByIdObserver$: Observable<any> = this.getCameraByIdObserver.pipe();

  async getCameras() {
    const getCamerasEnded = (result: any) => {
      this.getCamerasObserver.next(result);
    };

    const result = await this.camerasService.getCameras().catch((error) => {
      this.handleError(error);
    });

    if (!result) {
      getCamerasEnded(false);
      return;
    }
    getCamerasEnded(result);
  }

  async getCameraById(id: any) {
    const getCameraByIdEnded = (result: any) => {
      this.getCameraByIdObserver.next(result);
    };

    const result = await this.camerasService
      .getCameraById(id)
      .catch((error) => {
        this.handleError(error);
      });

    if (!result) {
      getCameraByIdEnded(false);
      return;
    }
    getCameraByIdEnded(result);
  }
}
