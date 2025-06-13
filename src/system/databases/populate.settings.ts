export const getPopulateSettings = () => {
  const data = {
    client: { id: 'TAB.MUN.CEN', email: { email: 'tab.mun.cen@gmail.com', pwd: 'qqkcqiebdjpcyjml' } },
    soporte: { nombre: 'Soporte Técnico', email: 'panteratrix@hotmail.com' },
  };

  return `
     INSERT INTO settings (id, data) 
         VALUES ( 'setting', '${JSON.stringify(data)}')
         ON CONFLICT(id) DO UPDATE SET
             data = excluded.data;

     UPDATE parameters SET data = '1' where code = 'SETTING-INIT';
    `;
};
