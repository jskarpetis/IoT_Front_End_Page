import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationAPI } from '../eshopAPI/api/authenticationAPI';
import { AdminLoginResponse } from '../eshopAPI/models/AdminLoginResponse';
import { Values } from '../eshopAPI/settings';
import { GlobalsService } from './globals.service';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /**
   * @constructor
   * @param {AuthenticationAPI} api
   */
  constructor(
    private api: AuthenticationAPI,
    private globalService: GlobalsService
  ) {}

  private __autoAuthInput: any; //AuthenticateAdminInput

  get autoAuthInput() {
    return this.__autoAuthInput;
  }

  set autoAuthInput(value: any) {
    this.__autoAuthInput = value;
  }

  public authenticateAdmin(
    input: any,
    headers: HttpHeaders = null
  ): Promise<AdminLoginResponse> {
    return new Promise((resolve, reject) => {
      this.api
        .authenticateAdmin(input, headers)
        .then((result) => {
          Values.Token = result.body.access_token;
          this.globalService.token = result.body.access_token;
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
