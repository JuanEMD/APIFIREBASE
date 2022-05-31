import { createStore } from "vuex";
import router from "../router/";

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: "",
      nombre: "",
      categorias: [],
      estado: "",
      numero: 0,
    },

    // El "user" es la variable donde se verifica si hay un usuario logueado. Tambien es donde se guardan los datos del usuario que inicia sesion.
    user: null,
    error:{tipo: null, mensaje: null}
  },

  mutations: {
    //validaciones de errores
    setError(state, payload){
      if(payload === null){
        state.error = {tipo: null, mensaje: null}
      }
      if(payload === "EMAIL_NOT_FOUND"){
        return state.error = {tipo: 'email', mensaje: 'Email invalido'}
      }
      if(payload === "INVALID_PASSWORD"){
        return state.error = {tipo: 'password', mensaje: 'Contrasena incorrecta'}
      }
      if(payload === "EMAIL_EXISTS"){
        return state.error = {tipo: 'email', mensaje: 'Email existente'}
      }
      if(payload === "INVALID_EMAIL"){
        return state.error = {tipo: 'email', mensaje: 'Formato incorrecto de email'}
      }
    },
    //Es la mutacion con la que le asignamos la data del usuario a la variable "user".
    setUser(state, payload) {
      state.user = payload;
    },
    //Es la mutacion con la que le asignamos las tareas de la base de datos al arreglo "tareas"
    cargar(state, payload) {
      state.tareas = payload;
    },
    //Es la mutacion con la que introducimos una tarea nueva al arreglo "tareas"
    set(state, payload) {
      state.tareas.push(payload);
    },
    //Con esta mutacion filtramos la tarea seleccionada y la eliminamos del arreglo "tareas"
    delete(state, payload) {
      state.tareas = state.tareas.filter((item) => item.id !== payload);
    },
    //Con esta mutacion filtramos la tarea seleccionada
    //Se verifica si la tarea filtrada existe en el arreglo "tareas"
    edit(state, payload) {
      //si no exite, se redirecciona al usuario a la vista principal "/"
      if (!state.tareas.find((item) => item.id === payload)) {
        router.push("/");
        return;
      }
      //Si existe, el objeto "tarea" sera igual al objeto dentro del arreglo "tareas" con el mismo id seleccionado
      //Entonces el formulario en la vista EditarView tendra los valores de dicha tarea listos para ser editados
      state.tarea = state.tareas.find((item) => item.id === payload);
    },
    //Con esta mutacion se verifica si el item existe en el arreglo. Si existe, se reescribe el arreglo "tareas" y al final se redirecciona al usuario a la vista de inicio ('/')
    update(state, payload) {
      state.tareas = state.tareas.map((item) =>
        item.id === payload.id ? payload : item
      );
      router.push("/");
    },
  },
  actions: {
    //Cerrar sesion
    //Con esta accion utilizamos la mutacion "setUser" para asignarle a la variable "user" un valor nulo, luego la pag es redireccionada a la pagina de ingreso ("/ingreso")
    cerrarSesion({ commit }) {
      commit("setUser", null);
      router.push("/ingreso");
      localStorage.removeItem("usuario");
    },

    //inicio de sesion de usuario

    async ingresarUsuario({ commit }, usuario) {
      try {
        const respuesta = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDoYWkhSsBfqjZ1Zw6Y3U1BL1GAFqAC7nM",
          {
            method: "POST",
            body: JSON.stringify({
              email: usuario.email,
              password: usuario.password,
              returnSecureToken: true,
            }),
          }
        );
        const userDB = await respuesta.json();
        if (userDB.error) {
          console.log(userDB.error)
          return commit('setError', userDB.error.message)
        }
        commit("setUser", userDB)
        commit('setError', null)
        router.push("/");
        localStorage.setItem("usuario", JSON.stringify(userDB));
      } catch (error) {
        console.log(error);
      }
    },
    //registrar usuario en firebase
    //Esta accion hace una peticion POST de registro de usuario a firebase, utilizando como key la clave de api web del proyecto.
    //Envia el email, pasword y con la propiedad "returnSecureToken: true" indica que el usuario debe tener un token propio.
    async registrarUsuario({ commit }, usuario) {
      try {
        const respuesta = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDoYWkhSsBfqjZ1Zw6Y3U1BL1GAFqAC7nM",
          {
            method: "POST",
            body: JSON.stringify({
              email: usuario.email,
              password: usuario.password,
              returnSecureToken: true,
            }),
          }
        );
        //luego se guarda en una constante "userDB" la respuesta de esa peticion
        const userDB = await respuesta.json();
        // console.log(userDB);
        //Validar errores al agregar un usuario
        if (userDB.error) {
          return commit('setError', userDB.error.message)
        }
        //Si no hay errores, los datos del usuarios se asignan a la variable "user", se redirecciona al usuario a la vista principal ('/') 
        commit("setUser", userDB);
        commit('setError', null)
        router.push("/");
        //se guarda el usuario registrado en el local storage
        localStorage.setItem("usuario", JSON.stringify(userDB));
      } catch (error) {
        console.log(error);
      }
    },
    //Leer data de firebase
    //Antes que nada, al acceder a la vista principal "homeview", se verifica si hay un item ya en localstorage. 
    async cargarLocalStorage({ commit, state }) {
      //Si este existe, los datos de este item se asignan a la variable 'user'
      if (localStorage.getItem("usuario")) {
        commit("setUser", JSON.parse(localStorage.getItem("usuario")));
      } else {
        //si no existe, la variable sera igual a null.
        return commit("setUser", null);
      }
      try {
        //Si existe el elemento en el localstorage, se hace una peticion a la base de datos donde se pide un json de las tareas que tengan el localId del usuario actual.
        const respuesta = await fetch(
          `https://crudvuexfirebaseauthrutas-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken}`
        );
        
        //La respuesta de esta peticion se guarda en la constante "dataDB".
        const dataDB = await respuesta.json();
        const arrayTareas = [];
        
        //se recorre el id de todas las tareas dentro de la variable 'dataDB' y estos se guardan en 'arrayTareas'
        for (let id in dataDB) {
          arrayTareas.push(dataDB[id]);
        }
        //luego, los id dentro de array tareas se asignan al arreglo "state.tareas"
        commit("cargar", arrayTareas);
      } catch (error) {
        console.log(error);
      }
    },
    //agregar tareas a firebase
    //se hace una peticion POST a firebase con el locald del user, el id de la tarea y el token del user.
    async setTareas({ commit, state }, tarea) {
      try {
        const respuesta = await fetch(
          `https://crudvuexfirebaseauthrutas-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
          }
        );
        //nada
        const dataDB = await respuesta.json();
      } catch (error) {
        console.log(error);
      }
      //si no hay errores, la tarea actual se agrega al arreglo "tareas"
      commit("set", tarea);
    },
    //borrar tareas de firebase
    //se hace una peticion DELETE a firebase y se le pasa el localId del user, el id de la tarea y el idToken del user para borrar la tarea de firebase
    async deleteTareas({ commit, state }, id) {
      try {
        await fetch(
          `https://crudvuexfirebaseauthrutas-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${id}.json?auth=${state.user.idToken}`,
          {
            method: "DELETE",
          }
        );
        //se llama la accion delete y se le pasa el id de la tarea para eliminarla del array 'tareas'
        commit("delete", id);
      } catch (error) {
        console.log(error);
      }
    },
    //editar tarea dentro del arreglo 'tareas'
    editTarea({ commit }, id) {
      commit("edit", id);
    },
    //se hace una peticion PATCH a firebase, se le pasa el localId del usuario, el id de la tarea y el idToken del usuario.
    async updateTarea({ commit, state }, tarea) {
      try {
        const respuesta = await fetch(
          `https://crudvuexfirebaseauthrutas-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`,
          {
            method: "PATCH",
            body: JSON.stringify(tarea),
          }
        );
        //si no hay errores, se guarda la respuesta (tarea) dentro de la constante 'dataDB'
        const dataDB = await respuesta.json();
        //editar arreglo de tareas con los nuevos datos
        commit("update", dataDB);
      } catch (error) {
        console.log(error);
      }
    },
  },
  //esto verifica si la variable 'user' no es null para saber si hay un usuario logueado
  getters: {
    usuarioAutenticado(state) {
      return !!state.user;
    },
  },
  modules: {},
});
