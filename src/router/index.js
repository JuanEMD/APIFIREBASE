import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {rutaProtegida: true}
    },
    {
      path: '/editar/:id',
      name: 'editar',
      component: () => import('../views/EditarView.vue'),
      meta: {rutaProtegida: true}
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue')
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: () => import('../views/IngresoView.vue')
    }
  ]
})

//rutas protegidas
// se define "meta: {rutaProtegida: true}" en las rutas que se desea proteger
//Se utiliza el beforeeach para que las rutas, antes de ser accesadas, primero sean procesadas.

//se accede a una ruta y esta es procesada
router.beforeEach((to, from, next) => {
  //se verifica si esta ruta fue asignada como protegida
  if(to.meta.rutaProtegida){
    //si lo anterior es cierto, se verifica si hay un usuario logueado
    if(store.getters.usuarioAutenticado){
      //si lo anterior es verdadero, se accede a la ruta solicitada
      next()
    } else {
      //si no hay un usuario registrado y verificado, se redirecciona a la vista /ingreso
      next('/ingreso')
    }
    //si la ruta no es protegida, se accede a la ruta solicitada directamente
  } else {
    next()
  }
})

export default router
