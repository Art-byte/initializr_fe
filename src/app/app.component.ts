import {Component, inject, NgModule, OnInit} from '@angular/core';
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
import {Dependencies} from "./shared/models/dependencies";
import {CommonModule} from "@angular/common";
import {DependenciesModalComponent} from "./components/dependencies-modal/dependencies-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    SpinnerComponent,
    CommonModule,
    DependenciesModalComponent
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
  dependenciesList: any[] = [];

  //Esta lista almacena las dependencias seleccionadas
  depDummyList: string[] = ["java", "python", "javascript"];

  buildFormGroup: FormGroup;

  dataLoaded: boolean = false;
  isCollapsed = false;
  showModal = false;

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
      const validateData = this.buildService.hasPreviousData();
      if(validateData){
        console.log("Usamos los datos en memoria")
        const data: BuildData = JSON.parse(sessionStorage.getItem("buildData"));
        this.loadDataFromSession(data);
      } else {
        this.buildService.getAllParameters().subscribe((data: BuildData) => {
          console.log("Cargamos desde 0")
          sessionStorage.setItem("buildData", JSON.stringify(data));
          this.loadDataFromSession(data);
        });
      }
    }

    loadDataFromSession(data: BuildData) {
      this.setValuesDefault(data);
      this.readLanguageBody(data.language);
      this.readTypeBody(data.type);
      this.readSpringBoorVersions(data.bootVersion);
      this.readPackaging(data.packaging);
      this.readJavaVersion(data.javaVersion);
      this.readDependencies(data.dependencies);
      this.dataLoaded = true;
    }

  setValuesDefault(data: BuildData): void{
    this.buildFormGroup.get('groupId').setValue(data.groupId);
    this.buildFormGroup.get('artifactId').setValue(data.artifactId);
    this.buildFormGroup.get('name').setValue(data.name);
    this.buildFormGroup.get('description').setValue(data.description);
    this.buildFormGroup.get('packageName').setValue(data.packageName);
  }

  sendAndClean(){
      this.buildFormGroup.reset();
      this.getAllParameters();
  }

  readDependencies(pDependencies: Dependencies){
      this.dependenciesList = pDependencies.values;
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

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
