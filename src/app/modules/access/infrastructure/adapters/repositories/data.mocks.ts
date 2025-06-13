import { RoleEntity, UserEntity } from '../../../domain/entities';

export const mockRoles: RoleEntity[] = [
  {
    id: 'admin',
    name: 'admin',
    options: { isAdmin: true, isSystem: true, },
  },
  {
    id: 'conta',
    name: 'conta',
    options: { isAdmin: false, isSystem: true, },
    permissions: [
      {
        resource: 'CUENTA',
        actions: { api: ['CREAR', 'MODIFICAR', 'ELIMINAR', 'CONSULTAR'], module: ['FCTA-MD-SUBCUENTA', 'FCTA-MD-NOMBRE', 'FCTA-SUBDIVIDIR'], },
      },
      {
        resource: 'POLIZA',
        actions: { api: ['CREAR', 'MODIFICAR', 'ELIMINAR', 'CONSULTAR'], module: ['FPOL-MODIFICAR-NUMERO', 'FPOL-MODIFICAR-TIPO'],},
      },
    ],
  },
  {
    id: 'cuenta-no',
    name: 'cuenta-no',
    options: { isAdmin: false, isSystem: true, isDisabled: true,},
    permissions: [ { resource: 'CUENTA', actions: { api: ['TODO'], module: ['TODO'], }, }, ],
  },
  {
    id: 'cuenta-all',
    name: 'cuenta-all',
    options: { isAdmin: false, isSystem: true, },
    permissions: [ { resource: 'CUENTA', actions: {api: ['TODO'], module: ['TODO'],}, },],
  },
];

export const mockUsers: UserEntity[] = [
  {
    userId: '0',
    scope: {
      domain: 'DC1',
      subdomain: 'PRINCIPAL',
      apps: ['core'],
    },
    name: 'user0',
    password: '123',
    roles: [],
  },
  {
    userId: '1',
    scope: {
      domain: 'DC1',
      subdomain: 'PRINCIPAL',
      apps: ['core'],
    },
    name: 'user1',
    password: '123',
    roles: ['admin'],
  },
  {
    userId: '2',
    scope: {
      domain: 'DC1',
      subdomain: 'PRINCIPAL',
      apps: ['core'],
    },
    name: 'user2',
    password: '123',
    roles: ['conta'],
  },
  {
    userId: '3',
    scope: {
      domain: 'DC1',
      subdomain: 'PRINCIPAL',
      apps: ['core'],
    },
    name: 'user3',
    password: '123',
    roles: ['poliza'],
  },
];
