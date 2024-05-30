const db = require('../db');

const contactsRouter = require('express').Router(); // router es para aceptar los metodos post get ..
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;
contactsRouter.post('/', async (request, response) => {
  try {
    //obtener el nombre y telefono del body
    //paso 1
    const { name, phone } = request.body;
    //paso 2
    //validar el nombre y telefono
    if (!REGEX_NAME.test(name)) {
      return response.status(400).json({ error: 'el nombre es invalido' });
    } else if (!REGEX_NUMBER.test(phone)) {
      return response.status(400).json({ error: 'el numero es invalido' });
    }

    //paso 3
    //crear usuario en la base de datos
    //signo de interrogacion   es para acceder  a los parametros name phone user_id ruturning * retorna todo lo que esta en la base de datos
    const statement = db.prepare(
      'INSERT INTO contact (name,phone,user_id) VALUES (?, ?, ?) RETURNING *',
    );
    const newUser = statement.get(name, phone, Number(request.query.userId));
    //enviado mensaje de creacion de usuario
    return response.status(200).json(newUser);
  } catch (error) {
    //comprando que el email ya existe
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return response.status(400).json({ error: 'el numero es repetido' });
    }
    //en caso que te suceda otro error que no se conoce colocar esto
    return response.sendStatus(400);
  }
});

//exportar
module.exports = contactsRouter;
