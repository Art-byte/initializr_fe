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

  ngOnInit(): void {
    console.log("Dependencies => " + this.dependencies);
  }

  close() {
    this.closeModal.emit();
  }
}
