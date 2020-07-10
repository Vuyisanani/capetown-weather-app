import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RequestCache } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  
  constructor(private requestcache: RequestCache) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req.headers.set("Access-Control-Allow-Origin", "*");
    const cachedResponse = this.requestcache.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.requestcache);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler,
    requestcache: RequestCache): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          requestcache.put(req, event);
        }
      })
    );
  }
}