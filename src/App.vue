<script>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { mapActions } from "vuex";

export default {
  components: {
    Navbar,
  },
  methods: {
    ...mapActions(["cargarLocalStorage"]), 
  },
  created(){
    this.cargarLocalStorage() //accion de vuex para cargar el local storage cuando se inice la app
  }
}
</script>

<template>
  <Navbar />
  <div class="container">
    <RouterView />
  </div>
</template>

<style></style>
