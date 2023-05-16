import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/ProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/:projectSlug',
          name: 'project',
          component: ProjectView
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ],
  
  // Nothing works for now :(
  // scrollBehavior(to, from, savedPosition) {
  //   if(savedPosition && to.name == "home" && from.name == "project" && from.params.projectSlug) {
  //     console.log(savedPosition)
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         resolve({ 
  //         //   left: 0, 
  //         //   top: 0, 
  //           el: document.querySelector(`.project-${from.params.projectSlug}`),
  //           behavior: 'smooth'
  //         })
  //       }, 100)
  //     })
  //     return {
  //       left: 0,
  //       top: 0,
  //       // el: document.querySelector(`.project-${from.params.projectSlug}`)
  //     }
  //   }
  //   return { }
  // },
})

export default router
