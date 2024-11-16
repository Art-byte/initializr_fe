import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BuildService} from "./shared/services/build.service";
import {BuildData} from "./shared/models/build-data";
import {Type} from "./shared/models/type";
import {Language} from "./shared/models/language";
import {BootVersion} from "./shared/models/boot-version";
import {Packaging} from "./shared/models/packaging";
import {JavaVersion} from "./shared/models/java-version";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpinnerComponent} from "./components/spinner/spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  packagingList: any[] = [];
  typeList: any[] = [];
  languageList: any[] = [];
  bootVersions: any[] = [];
  javaVersionList: any[] = [];
  buildFormGroup: FormGroup;

  dataLoaded: boolean = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly buildService = inject(BuildService);

    ngOnInit(): void {
      this.initForm();
      this.getAllParameters();
    }

    initForm():void {
      this.buildFormGroup = this.formBuilder.group({
        groupId: new FormControl('', Validators.required),
        artifactId: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        packageName: new FormControl('', Validators.required)
      });
    }

    getAllParameters(){
      this.dataLoaded = false;
      this.buildService.getAllParameters().subscribe((data: BuildData) => {
        this.setValuesDefault(data);
        this.readLanguageBody(data.language);
        this.readTypeBody(data.type);
        this.readSpringBoorVersions(data.bootVersion);
        this.readPackaging(data.packaging);
        this.readJavaVersion(data.javaVersion);
        this.dataLoaded = true;
      })
    }

  setValuesDefault(data: BuildData): void{
    this.buildFormGroup.get('groupId').setValue(data.groupId);
    this.buildFormGroup.get('artifactId').setValue(data.artifactId);
    this.buildFormGroup.get('name').setValue(data.name);
    this.buildFormGroup.get('description').setValue(data.description);
    this.buildFormGroup.get('packageName').setValue(data.packageName);
  }

  readJavaVersion(pJavaVersion: JavaVersion): void{
      this.javaVersionList = pJavaVersion.values;
    }

    readPackaging(pPackaging: Packaging): void {
      this.packagingList = pPackaging.values;
    }

    readSpringBoorVersions(pBoot: BootVersion): void {
      this.bootVersions = pBoot.values;
    }

    readLanguageBody(pLang: Language): void {
      this.languageList = pLang.values;
    }

    readTypeBody(pType: Type): void {
      this.typeList = pType.values.filter(p => p.name !== "Gradle Config" && p.name !== "Maven POM");
    }


}
