import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http2IoT } from '../http2IoT';
import { GetCamerasResponse } from '../models/GetCamerasResponse';

@Injectable({
  providedIn: 'root',
})
export class CamerasAPI {
  constructor(private http2IoT: Http2IoT) {}

  /**
   * Get all the products from our protected resource
   * @param {HttpHeaders} headers if needed to add extra headers except defaults
   * @returns {Promise<GetProductsResponse>} Promise with all products
   */
  public getCameras(headers: HttpHeaders = null): Promise<GetCamerasResponse> {
    return this.http2IoT.get({
      headers: headers,
      path: '/cameras',
      isAuth: false,
    });
  }

  /**
   * Get a product by a specific unique ID of its properties.
   * @param {HttpHeaders} headers extra headers if needed to be added
   * @param queryParams query params in order to pass the ID of product
   * @returns {Promise<any>} Promise of type IProduct which contains a single product with the requested id
   */
  public getCameraById(
    headers: HttpHeaders = null,
    queryParams: any
  ): Promise<any> {
    return this.http2IoT.get({
      headers: headers,
      path: `/cameras/${queryParams}`,
      isAuth: false,
    });
  }
}
