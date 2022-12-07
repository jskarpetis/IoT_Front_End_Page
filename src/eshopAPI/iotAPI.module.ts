import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Http2IoT } from './http2IoT';
import { AuthenticationAPI } from './api/authenticationAPI';

@NgModule({
  imports: [HttpClientModule],
  providers: [Http2IoT, AuthenticationAPI],
})
export class IoTApiModule {
  constructor(@Optional() @SkipSelf() parentModule: IoTApiModule) {
    if (parentModule) {
      throw new Error(
        'Http2IoT Module is already loaded. Import it in the AppModule only'
      );
    }
  }
}
