import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http2IoT } from '../http2IoT';
import { Constants } from '../settings';
import Settings = Constants.Settings;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationAPI {
  constructor(private Http2IoT: Http2IoT) {}

  public authenticateAdmin(
    input: AdminLoginInput,
    headers: HttpHeaders = null
  ) {
    return this.Http2IoT.post({
      headers: headers,
      path: `${Settings.URL_AUTH_PREFIX}`,
      input: input,
      isAuth: true,
    });
  }
}

export interface AdminLoginInput {
  userName?: string;
  passWord?: string;
  userGroupId?: string;
}
