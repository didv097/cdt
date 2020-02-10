import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/pages',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Lock',
          path: 'lock',
          component: () => import('@/views/pages/Lock'),
        },
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Root level
        {
          name: 'Companies',
          path: 'companies',
          component: () => import('@/views/dashboard/Companies/Index'),
        },
        {
          name: 'Company Detail',
          path: 'companies/:id',
          redirect: 'companies/:id/info',
          component: () => import('@/views/dashboard/Companies/view/Index'),
          children: [
            {
              name: 'Company / Information',
              path: 'info',
              component: () => import('@/views/dashboard/Companies/view/Info'),
            },
            {
              name: 'Company / Addresses',
              path: 'addresses',
              component: () => import('@/views/dashboard/Companies/view/Addresses'),
            },
            {
              name: 'Company / Plan Holder',
              path: 'plan',
              component: () => import('@/views/dashboard/Companies/view/PlanHolder'),
            },
            {
              name: 'Company / Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Companies/view/SMFF'),
            },
            {
              name: 'Company / Affiliates',
              path: 'companies',
              component: () => import('@/views/dashboard/Companies/view/OperatedCompanies'),
            },
            {
              name: 'Company / Individuals',
              path: 'individuals',
              component: () => import('@/views/dashboard/Companies/view/Individuals'),
            },
            {
              name: 'Company / Documents',
              path: 'documents',
              component: () => import('@/views/dashboard/Companies/view/Documents/Index'),
            },
            {
              name: 'Company / Documents View',
              path: 'documents/:code',
              component: () => import('@/views/dashboard/Companies/view/Documents/View'),
            },
            {
              name: 'Company / Vessels',
              path: 'vessels',
              component: () => import('@/views/dashboard/Companies/view/Vessels'),
            },
          ],
        },
        {
          name: 'Vessels',
          path: 'vessels',
          component: () => import('@/views/dashboard/Vessels/Index'),
        },
        {
          name: 'Vessel Detail',
          path: 'vessels/:id',
          redirect: 'vessels/:id/info',
          component: () => import('@/views/dashboard/Vessels/view/Index'),
          children: [
            {
              name: 'Vessel / Information',
              path: 'info',
              component: () => import('@/views/dashboard/Vessels/view/Info'),
            },
            {
              name: 'Vessel / Construction',
              path: 'construction',
              component: () => import('@/views/dashboard/Vessels/view/Construction'),
            },
            {
              name: 'Vessel / Fire Plans',
              path: 'fire-plans',
              component: () => import('@/views/dashboard/Vessels/view/FirePlans'),
            },
          ],
        },
        {
          name: 'Individuals',
          path: 'individuals',
          component: () => import('@/views/dashboard/Individuals'),
        },
        {
          name: 'System Reports',
          path: 'reports',
          component: () => import('@/views/dashboard/Reports'),
        },
        {
          name: 'COP Map',
          path: 'map',
          component: () => import('@/views/dashboard/Map'),
        },
        {
          name: 'Fleets',
          path: 'fleets',
          component: () => import('@/views/dashboard/Fleets'),
        },
        {
          name: 'Geographic Annexes',
          path: 'gsa',
          component: () => import('@/views/dashboard/GSA'),
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
        },
      ],
    },
  ],
})
