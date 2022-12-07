import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CamerasAPI } from '../eshopAPI/api/camerasAPI';
import { GetCamerasResponse } from '../eshopAPI/models/GetCamerasResponse';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private api: CamerasAPI) {}

  public getCameras(headers: HttpHeaders = null): Promise<GetCamerasResponse> {
    return new Promise((resolve, reject) => {
      this.api
        .getCameras(headers)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getCameraById(
    queryParams: any,
    headers: HttpHeaders = null
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .getCameraById(headers, queryParams)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
