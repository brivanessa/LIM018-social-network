// Vista del muro donde se ven las publicaciones
import {
  onSnapshot,
  auth,
  query,
  collection,
  db,
  orderBy,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  addDoc,
  Timestamp,
} from '../lib/firebase.js';

export const homeTemplate = () => {
  const viewHome = ` 
    <div class="information-user"> 
      <div class="container-info">
        <div class="container-user-photo">
          <div class="photo-user">
            <img alt="Foto del usuario" class ='user-home-photo'>
          </div>
        </div>
        <div class="data-user">
          <p id="name-profile"> </p>
          <p id="user-profile"> </p>
        </div>
      </div>
      <button class="go-profile"> 
        <a href="#/profile">
          <img src="images/profile.png">
          VER MI PERFIL 
        </a>
      </button>  
    </div>
    <div class="container-publications">
      <form class="form-publication" id="form-publication">
        <textarea name="post" id ="comment" minlength="4" maxlength="600" rows="6" cols="12"  placeholder="¿Qué nos quieres decir?"> </textarea>
        <div class="container-button">
          <label for="upload" class="photo-change-post"> <img src="https://cdn-icons-png.flaticon.com/512/16/16410.png" class="upload-photo"> </label>
          <input id="upload" accept="image/jpeg" type="file" class="cargar-foto" >
          <input type="submit" title="Click to post" value="Compartir" class="post-button" id="post-button-form">
        </div>
      </form>
      <div class="all-publications" id='all-publications'> </div>
      <div class="background-modal-edit">
        <div class="modal-post-edit">
          <p> EDITAR POST </p>
          <input type="text" id="edit-post" placeholder="Edita tu post"> </input>
          <button class="save-post"> GUARDAR CAMBIOS </button>
          <button class="close-modal"> CERRAR </button>
        </div>
      </div>
    </div>`;
  const divElem = document.createElement('section');
  divElem.id = 'home';
  divElem.innerHTML = viewHome;
  return divElem;
};

export const userImg = (img) => (img !== '' ? img : 'images/user.png');

// PERFIL DEL USUARIO EN HOME (activeUserHome)
export const activeUserHome = async () => {
  const uid = auth.currentUser.uid;
  const docRef = doc(db, 'userdata', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userImgHome = docSnap.data().photo;
    const pic = userImg(userImgHome);
    const userPhoto = document.querySelector('.user-home-photo');
    userPhoto.setAttribute('src', pic);
    const nameHome = document.querySelector('#name-profile');
    nameHome.innerHTML = `${docSnap.data().name}`;
    const emailHome = document.querySelector('#user-profile');
    emailHome.innerHTML = `${docSnap.data().email}`;
  }
};

export function shareLike() {
  const buttonLike = document.querySelectorAll('.button-like');
  buttonLike.forEach((boton) => {
    boton.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = e.target.dataset.id;
      const docRef1 = doc(db, 'post', id);
      const docSnap = await getDoc(docRef1);
      if (docSnap.exists()) {
        const likesData = docSnap.data().likes;
        const user = auth.currentUser;
        if (likesData.includes(user.uid)) {
          // console.log('ya no me gusta');
          boton.classList.add('active-like');
          updateDoc(docRef1, {
            likes: likesData.filter((item) => (item !== user.uid)),
          });
        } else {
          // console.log('me gusta');
          updateDoc(docRef1, {
            likes: [...likesData, user.uid],
          });
        }
      }
    });
  });
}

export const closeModalEdit = () => {
  const modalEdit = document.querySelector('.close-modal');
  modalEdit.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.background-modal-edit').style.visibility = 'hidden';
  });
  return ('closed modal');
};

const editPost = () => {
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach((edit) => {
    edit.addEventListener('click', (event) => {
      document.querySelector('.background-modal-edit').style.visibility = 'visible';
      const saveButton = document.querySelector('.save-post');
      saveButton.addEventListener('click', async () => {
        const id = event.target.dataset.id;
        const docRef = doc(db, 'post', id);
        const newPost = document.querySelector('#edit-post').value;
        await updateDoc(docRef, {
          posts: newPost,
        });
        document.querySelector('.background-modal-edit').style.visibility = 'hidden';
      });
      closeModalEdit();
    });
  });
};

const deletePost = (id) => deleteDoc(doc(db, 'post', id)); // deleteDoc es promesa de firestore

export const closeModalDelete = () => {
  const modalDelete = document.querySelector('.close-modalDelete');
  modalDelete.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.background-modal-delete').style.visibility = 'hidden';
  });
};

export function deletePosts() {
  const btnsDelete = document.querySelectorAll('.delete-button');
  // console.log(btnsDelete);
  btnsDelete.forEach((boton) => {
    boton.addEventListener('click', (event) => { // al ejecutar un btn (con clic p.e.) y para traer info del btn se usa un evento
      // 1. si queremos estructurar el objeto event es = { target:{ dataset } }
      // console.log(event); >see to event object.I need target property>target.dataset>dataset.id
      // console.log(event.target.dataset.id);
      const modalError = document.querySelector('.background-modal-delete');
      modalError.style.visibility = 'visible';
      const deleteYes = document.getElementById('deleteYes');
      const deleteNo = document.getElementById('deleteNo');
      deleteYes.addEventListener('click', (e) => {
        e.preventDefault();
        const containerModal = document.querySelector('.background-modal-delete');
        containerModal.style.visibility = 'hidden';
        deletePost(event.target.dataset.id);
      });
      closeModalDelete();
      deleteNo.addEventListener('click', (e) => {
        e.preventDefault();
        const containerModal = document.querySelector('.background-modal-delete');
        containerModal.style.visibility = 'hidden';
      });
    });
  });
}

// Obtener los post en tiempo real
export const onGetPosts = async () => {
  const user = auth.currentUser;
  const q = query(collection(db, 'post'), orderBy('datePosted', 'desc'));
  onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((dok) => {
      posts.push(Object.assign(dok.data(), { id: dok.id }));
    });
    const home = document.getElementById('all-publications');
    home.innerHTML = '';
    posts.forEach((post) => {
      let onePost = `
      <div class="publication" >
        <p class="user-name-post"> ${post.correo} </p> <!--Agregar nombre y foto del individuo-->
        <p class="publication-text"> ${post.posts} </p>
        <p class="see-likes"> ${post.likes.length} 💖 </p>
        <div class="container-post-button">
          <button data-id='${post.id}' class="button-like"> ❤ Me gusta </button>`;
      if (post.uid === user.uid) {
        onePost += `
          <div class="active-user-buttons">
            <button title="Edit post" class="edit-button" data-id='${post.id}'> Editar </button>
            <button title="Delete post" class="delete-button" data-id='${post.id}'> Eliminar </button>  <!--data-xxxx (propiedad de html que guarda datos dentro del boton)-->
          </div>
        </div>
      </div>
        <div class="background-modal-delete">
          <div class="modal-delete">
            <p> ¿Estas seguro de borrar este post? <img src="https://emoji.slack-edge.com/T0NNB6T0R/sad_parrot/63bb67f63f6b6d9d.gif"> </p>
            <div class="btns-delete">
              <button class="close-modalDelete btnDelete" id='deleteYes'> SI </button>
              <button class="close-modalDelete btnDelete" id='deleteNo'> NO </button>
            </div>
          </div>
        </div>
      </div>`;
      } else {
        onePost += '</div>';
      }
      home.innerHTML += onePost;
    });
    shareLike();
    deletePosts();
    editPost();
  });
};
// FUNCION  PARA COMPARTIR UN POST EN HOME
export const savePost = (post) => {
  const user = auth.currentUser.uid;
  const email = auth.currentUser.email;
  addDoc(collection(db, 'post'), {
    posts: post,
    uid: user,
    correo: email,
    datePosted: Timestamp.fromDate(new Date()),
    likes: [],
  });
};

export function fSharePost() {
  const btnPublication = document.querySelector('#post-button-form');
  const formPublication = document.querySelector('#form-publication');
  btnPublication.addEventListener('click', (e) => {
    e.preventDefault();
    const postContent = document.querySelector('#comment').value;
    document.querySelector('#comment').value = '';
    savePost(postContent);
    formPublication.reset();
  });
}
