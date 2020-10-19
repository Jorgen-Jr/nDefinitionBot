//Carregar as variáveis de enviromnent.
if (process.env.NODE_ENV !== 'production') {
  if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({
      path: '.env.test',
    });
  } else {
    require('dotenv').config({
      path: '.env',
    });
  }
}
