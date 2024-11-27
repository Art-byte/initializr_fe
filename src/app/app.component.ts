import {Component, inject, OnInit} from '@angular/core';
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
import {DepBody} from "./shared/models/dep-body";
import {TypeValues} from "./shared/models/type-values";
import {PackageValues} from "./shared/models/package-values";
import {LangValues} from "./shared/models/lang-values";
import {BootValues} from "./shared/models/boot-values";
import {JavaValues} from "./shared/models/java-values";
import {Archetype} from "./shared/models/archetype";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SpinnerComponent,
    CommonModule,
    DependenciesModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  packagingList: PackageValues[] = [];
  typeList: TypeValues[] = [];
  languageList: LangValues[] = [];
  bootVersions: BootValues[] = [];
  javaVersionList: JavaValues[] = [];
  dependenciesList: any[] = [];

  //Esta lista almacena las dependencias seleccionadas
  depFromModal: DepBody[] = [];

  //Aqui capturamos los radiobuttons seleccionados
  javaVersionSelected: string;
  packagingSelected: string;
  languageSelected: string;
  typeSelected: string;
  bootVersionSelected: string;

  buildFormGroup: FormGroup;
  archtype: Archetype;

  dataLoaded: boolean = false;
  showModal: boolean = false;
  depSelected = false;

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
        const data: BuildData = JSON.parse(sessionStorage.getItem("buildData"));
        this.loadDataFromSession(data);
      } else {
        this.buildService.getAllParameters().subscribe((data: BuildData) => {
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

  hasDependenciesSelected(){
      return this.depSelected = this.depFromModal.length > 0;
  }

  setValuesDefault(data: BuildData): void{
    this.buildFormGroup.get('groupId').setValue(data.groupId);
    this.buildFormGroup.get('artifactId').setValue(data.artifactId);
    this.buildFormGroup.get('name').setValue(data.name);
    this.buildFormGroup.get('description').setValue(data.description);
    this.buildFormGroup.get('packageName').setValue(data.packageName);
  }

  onDependenciesSelected(dependencies: DepBody[]){
      this.depFromModal = [];
      this.depFromModal = dependencies;
  }

  removeDependencies(index:string){
    this.depFromModal = this.depFromModal.filter(dep => dep.id != index);
  }

  sendAndClean(){
     this.archtype = new Archetype();
     this.archtype.dependencies = this.formatDependencyList(this.depFromModal);
     this.archtype.javaVersion = this.javaVersionSelected;
     this.archtype.packaging = this.packagingSelected;
     this.archtype.language = this.languageSelected;
     this.archtype.type = this.typeSelected;
     this.archtype.bootVersion = this.bootVersionSelected;

     this.archtype.groupId = this.buildFormGroup.get("groupId").value;
     this.archtype.artifactId = this.buildFormGroup.get("artifactId").value;
     this.archtype.name = this.buildFormGroup.get("name").value;
     this.archtype.description = this.buildFormGroup.get("description").value;
     this.archtype.packageName = this.buildFormGroup.get("packageName").value;

     const finalProjectName = this.archtype.name;

     this.buildService.sendBuildRequest(this.archtype).subscribe({
       next: (resp) => {
         const blob = new Blob([resp], {type: 'application/zip'})
         saveAs(blob, `${finalProjectName}.zip`);
          this.buildFormGroup.reset();
          this.getAllParameters();
          this.depFromModal = [];
       },
       error: (error) => {
         console.log("Error => ", error);
       },
       complete: () => {
         console.log("Proceso completado");
       }
     });
  }

  formatDependencyList(arr: DepBody[]): string {
    const finalArray = arr.map(dep => dep.id);
    return finalArray.join(', ');
  }


/*==================================================================
              Metodos para rellenar las listas de objetos
==================================================================*/

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

    /*==================================================================
     Metodos para capturar el evento de seleccion de radio buttons
==================================================================*/
    onJavaVersionSelected(javaVersion: string){
      this.javaVersionSelected = javaVersion;
    }

    onPackagingSelected(packageStr: string){
      this.packagingSelected = packageStr;
    }

    onLanguageSelected(language: string){
      this.languageSelected = language;
    }

    onTypeSelected(type: string){
      this.typeSelected = type;
    }

    onBootVersionSelected(boot: string){
      this.bootVersionSelected = boot;
    }
}
