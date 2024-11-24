import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AccountService } from '../../service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../interfaces/account.interface';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  submitted = false;
  accounts: Account[] = [];
  accountId: string | null = null;


  constructor(
    private fb: FormBuilder,
    private _accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.accountId = this.route.snapshot.paramMap.get('id');
    const today = new Date();
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    this.accountForm = this.fb.group({
      id: [{ value: '', disabled: this.accountId === null ? false : true }, Validators.required, [this.validatorId.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [
        '',
        [
          Validators.required,
          (control: AbstractControl) => {
            if (!control.value) return null;
            const inputTimestamp = new Date(control.value).getTime();
            return inputTimestamp >= todayTimestamp ? null : { minDate: true };
          },
        ],],
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
    }, { validators: this.revisionDateValidator });
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this._accountService.getAccounts().subscribe(
      (data) => {
        this.accounts = data;
        this.filterAccountById();
      },
      (error) => {
        console.error('Error al obtener las cuentas', error);
      }
    );
  }

  filterAccountById(): void {
    if (this.accountId !== null) {
      const filteredAccounts = this.accounts.filter((account) => account.id === this.accountId);
      filteredAccounts.length === 1 ? this.accountForm.patchValue(filteredAccounts[0]) : this.router.navigate(['/account-list']);
    }
  }

  revisionDateValidator(group: AbstractControl): ValidationErrors | null {
    const date_release = group.get('date_release')?.value;
    const date_revision = group.get('date_revision')?.value;

    if (!date_release || !date_revision) {
      return null;
    }

    const release = new Date(date_release);
    const review = new Date(date_revision);

    const oneYearLater = new Date(release);
    oneYearLater.setFullYear(release.getFullYear() + 1);

    const releaseFormatted = oneYearLater.toISOString().split('T')[0];
    const reviewFormatted = review.toISOString().split('T')[0];

    return releaseFormatted === reviewFormatted ? null : { invalidReviewDate: true };
  }

  calculateDateRevision(): void {
    const date_revision = new Date(this.accountForm.get('date_release')?.value);
    date_revision.setFullYear(date_revision.getFullYear() + 1);
    this.accountForm.get('date_revision')?.setValue(date_revision.toISOString().split('T')[0]);
  }

  resetForm(): void {
    this.submitted = false; // Si estás usando una bandera para controlar la visualización de errores
    this.accountForm.reset({
      id: '',
      name: '',
      description: '',
      date_release: '',
      date_revision: { value: '', disabled: true },
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.accountForm.valid) {
      const account: Account = {
        id: this.accountForm.get('id')?.value,
        name: this.accountForm.get('name')?.value,
        description: this.accountForm.get('description')?.value,
        logo: this.accountForm.get('logo')?.value,
        date_release: this.accountForm.get('date_release')?.value,
        date_revision: this.accountForm.get('date_revision')?.value,
      }
      if (this.accountId === null) {
        this._accountService.addAccount(account).subscribe(
          (data) => {
            this.router.navigate(['/account-list']);
          },
          (error) => {
            console.error('No es posible guardar', error);
          }
        );
      } else {
        const accountEdit: Account = {
          name: this.accountForm.get('name')?.value,
          description: this.accountForm.get('description')?.value,
          logo: this.accountForm.get('logo')?.value,
          date_release: this.accountForm.get('date_release')?.value,
          date_revision: this.accountForm.get('date_revision')?.value,
        }
        this._accountService.editAccount(this.accountId, accountEdit).subscribe(
          (data) => {
            this.router.navigate(['/account-list']);
          },
          (error) => {
            console.error('No es posible editar', error);  // handle error here 200, 404, 500 etc.  or use catchError() operator to handle error in a centralized way. 3rd party libraries like ngx-toastr can be used to show error messages. 404 error can be handled by displaying a 404 page etc. 500 error can be handled by displaying a generic error page etc.  For example: this.toastr.error('Error al guardar la cuenta');
          }
        )
      }

    } else console.log('Formulario inválido');
  }

  validatorId(control: AbstractControl) {
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((id) =>
        this._accountService.verifyAccountExist(id).pipe(
          map((exists) => (exists ? { idExists: true } : null)),
          catchError(() => of(null))
        )
      )
    );
  }
}
