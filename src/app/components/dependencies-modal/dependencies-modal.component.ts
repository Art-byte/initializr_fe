import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DependenciesValues} from "../../shared/models/dependencies-values";

@Component({
  selector: 'app-dependencies-modal',
  standalone: true,
  imports: [],
  templateUrl: './dependencies-modal.component.html',
  styleUrl: './dependencies-modal.component.css'
})
export class DependenciesModalComponent implements OnInit{

  @Input() isVisible: boolean = false;
  @Input() dependencies: DependenciesValues[] = [];
  @Output() closeModal = new EventEmitter<void>();
  openSections: Set<string> = new Set<string>();

  ngOnInit(): void {
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
