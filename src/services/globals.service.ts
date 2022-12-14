import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  private _token: string = null;
  private _id: string = null;
  private _cameraData: any[];

  get token() {
    return this._token;
  }
  set token(value: string) {
    this._token = value;
  }

  get id() {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get cameraData() {
    return this._cameraData;
  }

  set cameraData(cameraData: any[]) {
    this._cameraData = cameraData;
  }
}
