import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dependencies-modal',
  standalone: true,
  imports: [],
  templateUrl: './dependencies-modal.component.html',
  styleUrl: './dependencies-modal.component.css'
})
export class DependenciesModalComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
