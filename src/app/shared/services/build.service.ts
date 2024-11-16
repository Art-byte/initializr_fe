import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BuildData} from "../models/build-data";

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  private readonly source = "http://localhost:8080/api"
  private readonly http = inject(HttpClient);

  getAllParameters(): Observable<BuildData>{
    return this.http.get<BuildData>(`${this.source}/build/data`);
  }

  hasPreviousData(): boolean {
    const session = sessionStorage.getItem("buildData");
    return session !== null;
  }

}
