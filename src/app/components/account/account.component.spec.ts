import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { of, throwError } from 'rxjs';
import { Account } from '../../interfaces/account.interface';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
describe('AccountComponent', () => {
  let component: AccountComponent;
  let accountServiceMock: jest.Mocked<AccountService>;
  let routerMock: jest.Mocked<Router>;

  const mockAccounts: Account[] = [
    { id: '1', name: 'Account 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2024-11-11', date_revision: '2025-11-11' },
    { id: '2', name: 'Account 2', description: 'Desc 2', logo: 'logo2.png', date_release: '2024-10-11', date_revision: '2025-10-11' },
  ];

  beforeEach(() => {
    accountServiceMock = {
      getAccounts: jest.fn(),
      verifyAccountExist: jest.fn(),
      addAccount: jest.fn(),
      editAccount: jest.fn(),
    } as unknown as jest.Mocked<AccountService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = new AccountComponent(routerMock, accountServiceMock);
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener las cuentas al inicializar', () => {
    accountServiceMock.getAccounts.mockReturnValue(of(mockAccounts));

    component.ngOnInit();

    expect(accountServiceMock.getAccounts).toHaveBeenCalled();
    expect(component.accounts).toEqual(mockAccounts);
    expect(component.filteredAccounts).toEqual(mockAccounts);
  });

  it('debería manejar errores al obtener cuentas', () => {
    const errorResponse = new Error('Error al obtener cuentas');
    accountServiceMock.getAccounts.mockReturnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(accountServiceMock.getAccounts).toHaveBeenCalled();
    expect(component.accounts).toEqual([]);
    expect(component.filteredAccounts).toEqual([]);
  });

  it('debería filtrar cuentas al buscar', () => {
    component.accounts = mockAccounts;
    const mockEvent = { target: { value: 'Account 1' } } as unknown as Event;

    component.onSearch(mockEvent);

    expect(component.filteredAccounts).toEqual([mockAccounts[0]]);
  });

  it('debería cambiar el tamaño de la página correctamente', () => {
    const mockEvent = { target: { value: '10' } } as unknown as Event;

    component.changePageSize(mockEvent);

    expect(component.pageSize).toBe("10");
  });

  it('debería navegar al formulario al agregar una nueva cuenta', () => {
    component.addNewAccount();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/account-form']);
  });

  it('debería navegar al formulario al editar una cuenta', () => {
    const accountToEdit = mockAccounts[0];

    component.editAccount(accountToEdit);

    expect(routerMock.navigate).toHaveBeenCalledWith([`/account-form/${accountToEdit.id}`]);
  });

  it('debería retornar las cuentas visibles de acuerdo al tamaño de página', () => {
    component.filteredAccounts = mockAccounts;
    component.pageSize = 1;

    const displayedAccounts = component.displayedAccounts;

    expect(displayedAccounts).toEqual([mockAccounts[0]]);
  });

});
