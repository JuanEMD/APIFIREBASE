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
      <!-- v-for para imprimir las tareas en la tabla -->

      <tr v-for="item in tareas" :key="item.id">
        <th scope="row">{{ item.id }}</th>
        <td>{{ item.nombre }}</td>
        <td>
          <!-- {{ item.categorias.join(", ") }} -->
        </td>
        <td>{{ item.estado }}</td>
        <td>{{ item.numero }}</td>
        <td>
          <!-- Boton para eliminar tareas -->
          <button class="btn btn-danger btn-sm" @click="deleteTareas(item.id)">
            Eliminar
          </button>

          <!-- Boton para editar tareas. El RouterLink recibe el nombre de la vista y los parametros de esta. -->
          <RouterLink
            class="btn btn-warning btn-sm ml-2"
            :to="{
              name: 'editar',
              params: {
                id: item.id,
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
