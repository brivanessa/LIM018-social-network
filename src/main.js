// Este es el punto de entrada de tu aplicacion  // RELACION CON EL DOM

// import { myFunction } from './lib/index.js';

import {
  ingreso,
  registerUser,
} from './lib/index.js';
// AUTENTIFICACIÓN DE USUARIO

export const eventLogin2 = () => {
  const loginForm = document.querySelector('#form-login');
  loginForm.addEventListener('submit', () => {
    const email = document.getElementById('ingresaEmail').value;
    const password = document.getElementById('ingresaContrasena').value;
    ingreso(email, password);
  });
};

export const eventRegister = () => {
  const signUpForm = document.querySelector('#registerForm');
  signUpForm.addEventListener('submit', () => {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    registerUser(email, password);
  });
  // FUNCIÓN PARA INICIAR SESION DESPUES DE REGISTARTE
  const container = document.getElementById('container');
  container.innerHTML = '';
  container.appendChild(components.login());
};

// FUNCION PARA COMPARTIR UN POST EN HOME
export function sharePost() {
  const toShare = document.getElementById('toShare');
  let numberPost = 0;
  toShare.addEventListener('click', () => {
    const oldPost = `
      <div class="old-publication" >
        <p class="user-name-post">AQUI VA EL NOMBRE DE USUARIO</p>
        <input type="text" class="old-comment">
        <div class="container-button">
          <div class="emojis">
            <input type="button" title="Click to coment" value="🍿"  class="button-emoji" >
            <input type="button" title="Click to coment" value="🤍"  class="button-emoji" >
          </div>
         <input type="button" title="Click to coment" value="Comentar "  class="comment-button" >
        </div>
          </div>
      </div>`;

    const parentPost = document.getElementById('all-publications');
    const divElem = document.createElement('div');
    // se debe almacenar en un solo div porque sino "to Node.appendChild must be an instance of Nod"
    numberPost += 1;
    divElem.id = `post ${numberPost}`;
    divElem.innerHTML = oldPost;
    return parentPost.appendChild(divElem);
  });
}
