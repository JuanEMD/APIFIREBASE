<template>
  <b>ID:</b> {{ $route.params.id }}
  <br>
  <b>Tarea:</b> {{ tarea }}
  <hr>
  <form @submit.prevent="updateTarea(tarea)">
    <Input :tarea="tarea" />
  </form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Input from "../components/Input.vue";
export default {
  components: {
    Input,
  },
  computed: {
    //mapeo para utilizar la variable tareas del store en EditarView
    ...mapState(["tarea"]),
  },
  methods: {
    //mapeo para utilizar la accion editarTarea y updateTarea tareas del store en EditarView
    ...mapActions(["editTarea", "updateTarea"]),
  },
  created() {
    this.editTarea(this.$route.params.id);
  },
};
</script>
