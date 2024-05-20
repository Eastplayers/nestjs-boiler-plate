import { Inject, Injectable } from '@nestjs/common';
import {
  GetCurlPayloadDto,
  PostCurlPayloadDto,
  PutCurlPayloadDto,
  DeleteCurlPayloadDto,
} from './curl.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { isEmpty } from 'lodash';

@Injectable()
export class CurlService {
  private config: Record<string, any> = {};

  constructor(@Inject(HttpService) private httpService: HttpService) {
    this.config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    };
  }

  async get(payload: GetCurlPayloadDto): Promise<any> {
    const queryString = qs.stringify(payload.query, {
      encodeValuesOnly: true,
    });
    console.log(queryString);
    return lastValueFrom(
      this.httpService.get(
        payload.url + (payload.query ? `?${queryString}` : ''),
        {
          headers: {
            ...this.config.headers,
            ...payload.addheaders,
            ...(payload.token && { Authorization: `${payload.token}` }),
          },
          params: payload.params,
        },
      ),
    );
  }

  async post(payload: PostCurlPayloadDto): Promise<any> {
    return lastValueFrom(
      this.httpService.post(payload.url, payload.data, {
        headers: {
          ...this.config.headers,
          ...payload.addheaders,
          ...(payload.token && { Authorization: `${payload.token}` }),
        },
      }),
    );
  }

  async put(payload: PutCurlPayloadDto): Promise<any> {
    return lastValueFrom(
      this.httpService.put(payload.url, payload.data, {
        headers: {
          ...this.config.headers,
          ...payload.addheaders,
          ...(payload.token && { Authorization: `${payload.token}` }),
        },
      }),
    );
  }

  async delete(payload: DeleteCurlPayloadDto): Promise<any> {
    return lastValueFrom(
      this.httpService.delete(payload.url, {
        headers: {
          ...this.config.headers,
          ...(payload.token && { Authorization: `${payload.token}` }),
        },
        ...(!isEmpty(payload.data) && { data: payload.data }),
      }),
    );
  }
}
