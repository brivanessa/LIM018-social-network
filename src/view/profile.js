// Vista de la página de perfil
import {
  auth, doc, db, onSnapshot,
} from '../lib/firebase.js';

import { saveData } from '../lib/index.js';

import { countries } from './countries.js';

export const userImg = (img) => (img !== '' ? img : 'images/user.png');

export const activeUserProfile = async () => {
  const uid = auth.currentUser.uid;
  onSnapshot(
    doc(db, 'userdata', uid),
    { includeMetadataChanges: true },
    (dok) => {
      const userImgProfile = dok.data().photo;
      const pic = userImg(userImgProfile);
      const userPhoto = document.querySelector('.user-photo');
      userPhoto.setAttribute('src', pic);
      const userName = document.querySelector('.name-profile');
      userName.innerHTML = `${dok.data().name}`;
      const userEmail = document.querySelector('.email-profile');
      userEmail.innerHTML = `${dok.data().email}`;
      const userCountry = document.querySelector('#user-country');
      userCountry.innerHTML = `${dok.data().country}`;
      const userDescription = document.querySelector('.user-description');
      userDescription.innerHTML = `${dok.data().description}`;
      const userElection = document.querySelector('.user-election');
      userElection.innerHTML = `${dok.data().preference}`;
      const userGenre = document.querySelector('.user-genre');
      userGenre.innerHTML = `${dok.data().genre}`;
      const changeDescription = document.querySelector('#change-description');
      changeDescription.setAttribute('value', `${dok.data().description}`);
      const changeGenre = document.querySelector('#change-genre');
      changeGenre.setAttribute('value', `${dok.data().genre}`);
    },
  );
};

const preferences = ['¿Qué prefieres ver?', 'Series', 'Peliculas', 'Documentales', 'Anime'];

export const editProfile = () => {
  const uid = auth.currentUser.uid;
  document.getElementById('editProfile').addEventListener('click', (e) => {
    e.preventDefault();
    const containerModal = document.querySelector('.background-modal');
    containerModal.style.visibility = 'visible';
    const selectCountry = document.querySelector('#select-country');
    selectCountry.innerHTML = '';
    countries.forEach((userCountry) => {
      const category = `<option value="${userCountry}"> ${userCountry} </option>`;
      selectCountry.insertAdjacentHTML('beforeend', category);
    });
    selectCountry.children[0].disabled = true;
    const selectPreference = document.querySelector('#change-preferences');
    selectPreference.innerHTML = '';
    preferences.forEach((userPreference) => {
      const category = `<option value="${userPreference}"> ${userPreference} </option>`;
      selectPreference.insertAdjacentHTML('beforeend', category);
    });
    selectPreference.children[0].disabled = true;
    document.querySelector('#save-changes').addEventListener('click', () => {
      const country = selectCountry.options[selectCountry.selectedIndex].value;
      const preference = selectPreference.options[selectPreference.selectedIndex].value;
      const newDescription = document.getElementById('change-description').value;
      const favGenre = document.querySelector('#change-genre').value;
      saveData(uid, country, newDescription, preference, favGenre);
      containerModal.style.visibility = 'hidden';
    });
    document.querySelector('#close').addEventListener('click', () => {
      selectCountry.innerHTML = '';
      selectPreference.innerHTML = '';
      e.preventDefault();
      containerModal.style.visibility = 'hidden';
    });
  });
};

export const profileTemplate = () => {
  const viewProfile = `
  <section class="top-user-info"> 
    <div class="container-user-photo">
      <div class="photo-user">
        <img alt="Foto del usuario" class="user-photo">
      </div>
      <label for="edit" class="photo-change-user"> <img src="https://cdn-icons-png.flaticon.com/512/104/104668.png" class="change-photo"> </label>
      <input id="edit" accept="image/jpeg" type="file" class="cargar-foto" >
    </div>
   <p class="name-profile"> </p>
   <p class="email-profile"> </p>
   <div class="user-location">
     <p>📍</p>
     <p id="user-country"> </p>
   </div>
  </section>
  <section class="about-user">
    <p class="user-description"> </p>
    <p class="subtitle"> Prefiero ver:</p>
    <p class="user-election"> </p>
    <p class="subtitle"> Mi genero favorito es:</p>
    <p class="user-genre"> </p>
  </section>
  <button id="editProfile"> EDITAR MI PERFIL </button>
  <button id="return-home"> <a href="#/home"> VOLVER AL HOME </a> </button>
  <div class="background-modal">
    <div class="modal-card">
      <p> EDITAR PERFIL</p>
      <div id="edit-profile">
        <select id="select-country"> </select>
        <input type="text" id="change-description" placeholder="Aquí va tu descripción">
        <select id="change-preferences"> </select>
        <input type="text" id="change-genre" placeholder="¿Cuáles son tus géneros favoritos?">
        <button type="button" id="save-changes"> GUARDAR CAMBIOS </button>
        <button id="close" class="closeProfileModal"> CERRAR </button>
      </div>
    </div>
   </div>`;
  const divProfile = document.createElement('div');
  divProfile.classList = 'profile';
  divProfile.innerHTML = viewProfile;
  return divProfile;
};
