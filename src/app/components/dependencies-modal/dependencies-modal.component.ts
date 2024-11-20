import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DependenciesValues} from "../../shared/models/dependencies-values";
import { ReactiveFormsModule} from "@angular/forms";
import {DepBody} from "../../shared/models/dep-body";

@Component({
  selector: 'app-dependencies-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './dependencies-modal.component.html',
  styleUrl: './dependencies-modal.component.css'
})
export class DependenciesModalComponent {

  @Input() isVisible: boolean = false;
  @Input() dependencies: DependenciesValues[] = [];
  @Output() closeModal = new EventEmitter<void>();
  openSections: Set<string> = new Set<string>();
  selectedDependencies: DepBody[] = [];
  depObj: DepBody;

  onCheckboxChange(depId: string, depName: string, event: Event){
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.depObj = new DepBody();
    this.depObj.id = depId;
    this.depObj.name = depName;

    if(isChecked){
      this.selectedDependencies.push(this.depObj);
    } else {
      this.selectedDependencies = this.selectedDependencies.filter((dep) => dep.id !== this.depObj.id);
    }
  }

  saveDependencies(){
    this.close();
  }

  toggleSection(sectionName: string) : void{
    if(this.openSections.has(sectionName)){
      this.openSections.delete(sectionName);
    } else {
      this.openSections.add(sectionName);
    }
  }

  isSectionOpen(sectionName: string): boolean{
    return this.openSections.has(sectionName);
  }

  close() {
    this.closeModal.emit();
  }
}
