import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AccountFormComponent } from './account-form.component';

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let accountServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    accountServiceMock = {
      getAccounts: jest.fn().mockReturnValue(of([])),
      addAccount: jest.fn().mockReturnValue(of({ success: true })),
      editAccount: jest.fn().mockReturnValue(of({})),
      verifyAccountExist: jest.fn().mockReturnValue(of(false))
    };

    routerMock = {
      navigate: jest.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };

    component = new AccountFormComponent(
      new FormBuilder(),
      accountServiceMock,
      routerMock,
      activatedRouteMock
    );
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.accountForm).toBeDefined();
    expect(component.accountForm.controls['id']).toBeDefined();
    expect(component.accountForm.controls['name']).toBeDefined();
    expect(component.accountForm.controls['description']).toBeDefined();
    expect(component.accountForm.controls['logo']).toBeDefined();
    expect(component.accountForm.controls['date_release']).toBeDefined();
    expect(component.accountForm.controls['date_revision']).toBeDefined();
  });

  it('debería cargar las cuentas en ngOnInit', () => {
    const mockAccounts = [
      { id: '1', name: 'Cuenta 1', description: 'Descripción', logo: '', date_release: '', date_revision: '' }
    ];
    accountServiceMock.getAccounts.mockReturnValue(of(mockAccounts));

    component.ngOnInit();

    expect(accountServiceMock.getAccounts).toHaveBeenCalled();
    expect(component.accounts).toEqual(mockAccounts);
  });

  it('debería validar el ID como requerido', () => {
    const control = component.accountForm.get('id');
    control?.setValue('');
    expect(control?.errors?.['required']).toBeTruthy();
  });

  it('debería validar que el nombre tenga mínimo 5 caracteres', () => {
    const control = component.accountForm.get('name');
    control?.setValue('abc');
    expect(control?.errors?.['minlength']).toBeTruthy();
  });

  it('debería calcular automáticamente la fecha de revisión', () => {
    const date = new Date();
    component.accountForm.get('date_release')?.setValue(date.toISOString().split('T')[0]);
    component.calculateDateRevision();

    const expectedRevisionDate = new Date(date);
    expectedRevisionDate.setFullYear(date.getFullYear() + 1);

    expect(component.accountForm.get('date_revision')?.value).toEqual(
      expectedRevisionDate.toISOString().split('T')[0]
    );
  });

  it('debería reiniciar el formulario', () => {
    component.accountForm.get('name')?.setValue('Test Name');
    component.resetForm();

    expect(component.accountForm.get('name')?.value).toBe('');
    expect(component.submitted).toBe(false);
  });

  it('debería validar la fecha de revisión respecto a la fecha de liberación', () => {
    const releaseDate = new Date();
    const reviewDate = new Date(releaseDate);
    reviewDate.setFullYear(releaseDate.getFullYear() + 1);

    component.accountForm.get('date_release')?.setValue(releaseDate.toISOString().split('T')[0]);
    component.accountForm.get('date_revision')?.setValue(reviewDate.toISOString().split('T')[0]);

    const errors = component.revisionDateValidator(component.accountForm);
    expect(errors).toBeNull();
  });

  it('debería enviar el formulario correctamente al crear', () => {
    component.accountId = null;
    component.accountForm.patchValue({
      id: '1',
      name: 'Test Account',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.onSubmit();
    tick(); // Espera a que las operaciones asíncronas se completen

    expect(accountServiceMock.addAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Test Account',
        description: 'Test Description',
        logo: 'Test Logo',
        date_release: expect.any(String),
        date_revision: expect.any(String),
      })
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/account-list']);
  });

});
