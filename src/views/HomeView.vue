<script>
import Input from "../components/Input.vue";
import ListaTareas from "../components/ListaTareas.vue";
import { mapActions } from 'vuex';
import { nanoid } from 'nanoid';

export default {
  name: "HomeView",
  components: {
    Input,
    ListaTareas,
  },
  data() {
    return {
      tarea: {
        id: "",
        nombre: "",
        categorias: [],
        estado: "",
        numero: 0,
      },
    };
  },
  methods: {

    //mapeo para utilizar la accion setTareas tareas del store en HomeView
    ...mapActions(["setTareas", "cargarLocalStorage"]),

    procesarFormulario() {
      console.log(this.tarea);
      if (this.tarea.nombre.trim() === "") {
        console.log("Campo vacío");
        return;
      }
      console.log("no está vacio");

      //generar Id

      this.tarea.id = nanoid();

      // envian tareas
      this.setTareas(this.tarea);

      this.tarea = {
        id: '',
        nombre: "",
        categorias: [],
        estado: "",
        numero: 0,
      };
    },
  },
  created(){
    this.cargarLocalStorage()
  }
};
</script>


<template>
  <h1 class="my-5">Formularios con Vue.js</h1>

  <form @submit.prevent="procesarFormulario">
    <Input :tarea="tarea" />
  </form>
    <ListaTareas/>
  <hr />
  <p>
    {{ tarea }}
  </p>
</template>
