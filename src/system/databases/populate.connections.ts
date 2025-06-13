export const getPopulateConnections = () => {
  const contapoint = {
    server: 'localhost',
    database: 'contapoint',
    uid: 'conta',
    pwd: '123456',
  };

  const gestion = {
    server: 'localhost',
    database: 'contapoint',
    uid: 'conta',
    pwd: '123456',
  };

  return `
    INSERT INTO connections (id, name, connection, description ) 
          VALUES('1','contapoint', '${JSON.stringify(contapoint)}', 'Base de dato contapoint') ON CONFLICT(id) DO NOTHING;

    INSERT INTO connections (id, name, connection, description ) 
          VALUES('2','gestion', '${JSON.stringify(gestion)}', 'Base de dato de ejercicio actual') ON CONFLICT(id) DO NOTHING;
    `;
};
