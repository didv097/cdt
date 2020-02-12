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
              name: 'Company / VRP',
              path: 'plan',
              component: () => import('@/views/dashboard/Companies/view/VRP'),
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
            {
              name: 'Vessel / Drawings',
              path: 'drawings',
              component: () => import('@/views/dashboard/Vessels/view/Drawings'),
            },
            {
              name: 'Vessel / RAC Information',
              path: 'racs',
              component: () => import('@/views/dashboard/Vessels/view/RACs'),
            },
            {
              name: 'Vessel / SMFF Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Vessels/view/SMFF'),
            },
            {
              name: 'Vessel / AIS Data',
              path: 'ais',
              component: () => import('@/views/dashboard/Vessels/view/AIS'),
            },
            {
              name: 'Vessel / Notes',
              path: 'notes',
              component: () => import('@/views/dashboard/Vessels/view/Notes'),
            },
            {
              name: 'Vessel / Damage Stability Models',
              path: 'models',
              component: () => import('@/views/dashboard/Vessels/view/DSM'),
            },
          ],
        },
        {
          name: 'Individuals',
          path: 'individuals',
          component: () => import('@/views/dashboard/Individuals/Index'),
        },
        {
          name: 'Individual Detail',
          path: 'individuals/:id',
          redirect: 'individuals/:id/info',
          component: () => import('@/views/dashboard/Individuals/view/Index'),
          children: [
            {
              name: 'Individual / Information',
              path: 'info',
              component: () => import('@/views/dashboard/Individuals/view/Info'),
            },
            {
              name: 'Individual / Address',
              path: 'address',
              component: () => import('@/views/dashboard/Individuals/view/Address'),
            },
            {
              name: 'Individual / SMFF Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Individuals/view/SMFF'),
            },
            {
              name: 'Individual / Documents',
              path: 'documents',
              component: () => import('@/views/dashboard/Individuals/view/Documents'),
            },
            {
              name: 'Individual / Notes',
              path: 'notes',
              component: () => import('@/views/dashboard/Individuals/view/Notes'),
            },
            {
              name: 'Individual / Change Password',
              path: 'change-password',
              component: () => import('@/views/dashboard/Individuals/view/ChangePassword'),
            },
          ],
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
