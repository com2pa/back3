const supertest = require('supertest');
const app = require('../app'); //aplicacion de express
const { describe, test, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
let user;
//codigo jet
//test
describe('ruta contacts', () => {
  describe('crear contactos', () => {
    //borrar la base de datos antes de todos los test
    beforeAll(() => {
      //borrando todo los usuario de la base de datos si no le coloco el where
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        'INSERT INTO users (email) VALUES (?) RETURNING *', // ? es para el email RETURNING  * es para que me devuelva todo el usuario
      );
      user = statementCreateUser.get('com2pa@gmail.com');
    });
    //creancon contacto
    test('crea un contacto cuando todo es correcto', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Merwil Vegas', phone: '04142016224' })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        contact_id: 1,
        name: 'Merwil Vegas',
        phone: '04142016224',
        user_id: 1,
      });
    });
    test('devuelve un error cuando el numero es repetido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Merwil Vegas', phone: '04142016224' })
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        error: 'el numero es repetido',
      });
    });
    test('devuelve un error cuando el nombre  es invalido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Merwil vegas', phone: '04142016224' })
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        error: 'el nombre es invalido',
      });
    });
    test('devuelve un error cuando el numero  es invalido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Merwil Vegas', phone: '0142016224' })
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        error: 'el numero es invalido',
      });
    });
  });
}); //debe de traer respuesta en json
