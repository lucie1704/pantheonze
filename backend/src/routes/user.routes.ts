import { Router } from 'express'
import { UserController } from '@/controllers'
import { checkAuthentication } from '@/middlewares'

export default function (router: Router) {
  router.get(
    '/users/available-diets',
    UserController.getAvailableDiets
  )

  router.get(
    '/users/dietary-preferences',
    checkAuthentication,
    UserController.getUserDietaryPreferences
  )

  router.put(
    '/users/dietary-preferences',
    checkAuthentication,
    UserController.updateUserDietaryPreferences
  )

  router.post(
    '/users/dietary-preferences',
    checkAuthentication,
    UserController.addDietaryPreference
  )

  router.delete(
    '/users/dietary-preferences/:dietId',
    checkAuthentication,
    UserController.removeDietaryPreference
  )

  return router
} 