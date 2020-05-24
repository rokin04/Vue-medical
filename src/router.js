import Vue from "vue";
import VueRouter from "vue-router";
import Services from "./views/Services.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Services",
    component: Services
  },
 {
    path: "/newservice",
    name: "newservice",
    component: () =>
      import(/* webpackChunkName: "about" */ "./views/NewService.vue"),
    
  },
//   {
//     path: "/signup",
//     name: "signup",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/Signup.vue")
//   }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;