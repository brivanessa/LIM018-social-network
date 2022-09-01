import {
  eventRegisterFirebase, // es promesa // .then y .catch se usan para llamar a una promesa
  eventSetDoc,
} from '../lib/index.js';

// Vista de la página de registro

export const registerTemplate = () => {
  const viewRegister = `
  <div class="background-logo">
    <img class="img-logo" src="https://i.pinimg.com/originals/54/cc/e0/54cce0449cfd4414fdc19b068a97e00a.png">
  </div>
  <form class="register-form" id="register-form">
    <h1> Regístrate </h1>
    <p> Por favor registrate para iniciar sesión </p>
    <input id="user-name" type="text" placeholder="Nombre">
    <input id="user-email" type="email" placeholder="Correo electrónico">
    <input id="user-password" type="password" placeholder="Contraseña">
    <button id="register-button" type="submit"> REGISTRARME </button>
    <p> ¿Ya tienes cuenta? <a href="#/login"> Inicia sesión </a> </p>
  </form>
  <div class="background-modal">
    <div class="modal-error">
      <p class="register-error"> Hay un error </p>
      <button class="close-modal"> CERRAR </button>
    </div>
  </div>`;
  const divRegister = document.createElement('section');
  divRegister.id = 'register';
  divRegister.innerHTML = viewRegister;
  return divRegister;
};

// REGISTRO DE USUARIO

export const fEventRegister = () => {
  const signUpForm = document.querySelector('#register-form');
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const name = document.getElementById('user-name').value;
    const country = 'Ingresa tu país';
    const description = 'Cuéntanos un poco sobre ti';
    const photo = '';
    // console.log('dentro de register');
    eventRegisterFirebase(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const uid = user.uid;
        // setDoc(doc(db, 'userdata', uid), {
        //   email, password, name, uid, country, description, photo,
        // });
        eventSetDoc(uid, name, email, password, country, description, photo);
        window.location.hash = '#/login';
        return ('user is loged');
      })
      .catch((error) => {
        const errorCode = error.code;
        const modalError = document.querySelector('.background-modal');
        modalError.style.visibility = 'visible';
        const errorMessage = document.querySelector('.register-error');
        switch (errorCode) {
          case 'auth/email-already-in-use': {
            errorMessage.innerHTML = 'Email en uso, intenta iniciar sesión.';
            break;
          }
          case 'auth/invalid-email': {
            errorMessage.innerHTML = 'Proporcione una dirección de correo válida.';
            break;
          }
          case 'auth/internal-error': {
            errorMessage.innerHTML = 'El ingreso de contraseña es obligatorio.';
            break;
          }
          case 'auth/weak-password': {
            errorMessage.innerHTML = 'Tu contraseña debe tener al menos 6 caracteres.';
            break;
          }
          default: errorMessage.innerHTML = 'Vuelve a intentarlo.';
            break;
        }
      });
    // eventRegister(name, email, password, country, description, photo);
  });
};
