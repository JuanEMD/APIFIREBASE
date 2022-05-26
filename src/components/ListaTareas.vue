<!-- componente para mostrar las tareas del local storage -->

<template>
  <h1>Lista de Tareas</h1>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Categorías</th>
        <th scope="col">Estado</th>
        <th scope="col">Número</th>
        <th scope="col">Accion</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tarea, index) in tareas" :key="index">
        <!-- v-for para imprimir las tareas en la tabla -->
        <th scope="row">{{ tarea.id }}</th>
        <td>{{ tarea.nombre }}</td>
        <td>
          {{ tarea.categorias.join(", ") }}
          <!-- .join() para separar por coma los elementos del array categorias[] -->
          <!-- <span v-for="(item, index) in tarea.categorias" :key="index">
            {{ tarea.categorias.length === index + 1 ? item : item + ", " }}
          </span> -->
        </td>
        <td>{{ tarea.estado }}</td>
        <td>{{ tarea.numero }}</td>
        <td>
          <!-- Boton para eliminar tareas -->
          <button class="btn btn-danger btn-sm" @click="deleteTareas(tarea.id)">
            Eliminar
          </button>

          <!-- Boton para editar tareas. El RouterLink recibe el nombre de la vista y los parametros de esta. -->
          <RouterLink
            class="btn btn-warning btn-sm ml-2"
            :to="{
              name: 'editar',
              params: {
                id: tarea.id,
              },
            }"
          >
            Editar
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    //mapeo para utilizar la variable tareas del store en ListaTareas
    ...mapState(["tareas"]),
  },
  methods: {
    //mapeo para utilizar la accion delete tareas del store en ListaTareas
    ...mapActions(["deleteTareas"]),
  },
};
</script>
