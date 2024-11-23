import {
  Component,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
  signal,
  HostListener,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { WhistleFrame } from './whistleblow.model';
import { WhistleService } from '../services/whistle.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { finalize } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    DialogComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loadingState = signal(false);
  successState = signal(false);
  selectedFileName: string = '';
  selectedFile: any = null;
  errorMessage = signal('');
  private snackBarService = inject(NotificationService);
  private toastrService = inject(ToastrService);
  private whistleService = inject(WhistleService);
  private destroyRef = inject(DestroyRef);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
    }
  }
  submitWistleBlow(whistleForm: NgForm) {
    if (whistleForm.invalid) {
      // this.snackBarService.openSnackBar('Fill Required Input(s)');
      // this.toastrService.info("Please Fill Required Input(s)", 'Info')
      this.toastrService.error(
        'Jaza Angalau Taarifa na Sehemu Husika',
        'Error:'
      );
      this.controlMessage('Jaza Angalau Taarifa na Sehemu Husika');
      return;
    }
    const formData = new FormData();
    formData.append('attachment', this.selectedFile);
    formData.append('whistleblower', whistleForm.value.whistleblower);
    formData.append('email', whistleForm.value.email);
    formData.append('location', whistleForm.value.location);
    formData.append('phone', whistleForm.value.phone);
    formData.append('wahusika', whistleForm.value.wahusika);
    formData.append('taarifa_ziada', whistleForm.value.taarifa_ziada);
    formData.append('taarifa', whistleForm.value.taarifa);

    this.loadingState.set(true);
    const subscription = this.whistleService
      .addWhistle(formData)
      .pipe(
        finalize(() => {
          this.loadingState.set(false); // This will always run after next or error
        })
      )
      .subscribe({
        next: (result: any) => {
          this.successState.set(true);
          whistleForm.resetForm();
          this.controlMessage(result.message);
          this.toastrService.success(result.message, 'Success');
        },
        error: (error) => {
          const message = error.error.message;
          this.controlMessage('Changamto Imetokea, Tafadhali Rudia');
          this.toastrService.error(
            'Changamto Imetokea, Tafadhali Rudia',
            'Error:'
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  controlMessage(message: string) {
    this.errorMessage.set(message);
    setInterval(() => {
      this.errorMessage.set('');
    }, 5000);
  }

  onDialogClose() {
    this.successState.set(false);
  }
}
