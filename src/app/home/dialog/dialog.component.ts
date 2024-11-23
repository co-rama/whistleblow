import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatChipsModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Output() close = new EventEmitter<void>();
  @Input() message = signal('');
  router = inject(Router);
  onCancel() {
    this.close.emit();
    this.router.navigate(['']);
  }
}
