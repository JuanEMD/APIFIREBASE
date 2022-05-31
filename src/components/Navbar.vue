<template>
  <div class="navbar navbar-dark bg-dark">
      <RouterLink v-if="usuarioAutenticado" to="/" class="navbar-brand">Tareas</RouterLink>
    <div class="d-flex">
      <RouterLink v-if="!usuarioAutenticado" to="/ingreso" class="navbar-brand">Ingresar</RouterLink>
      <RouterLink v-if="!usuarioAutenticado" to="/registro" class="navbar-brand">Registrar</RouterLink>
      <button v-if="usuarioAutenticado" class="btn btn-dark" @click="cerrarSesion">Cerrar Sesion</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  computed:{
    ...mapGetters(['usuarioAutenticado'])
  },
  methods: {
    ...mapActions(['cerrarSesion'])
  },
};
</script>
