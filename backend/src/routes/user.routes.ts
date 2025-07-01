import { Router } from 'express'
import { UserController } from '@/controllers'
import { checkAuthentication } from '@/middlewares'

export default function (router: Router) {
  router.get(
    '/user/available-diets',
    UserController.getAvailableDiets
  )

  router.get(
    '/user/dietary-preferences',
    checkAuthentication,
    UserController.getUserDietaryPreferences
  )

  router.put(
    '/user/dietary-preferences',
    checkAuthentication,
    UserController.updateUserDietaryPreferences
  )

  router.post(
    '/user/dietary-preferences',
    checkAuthentication,
    UserController.addDietaryPreference
  )

  router.delete(
    '/user/dietary-preferences/:dietId',
    checkAuthentication,
    UserController.removeDietaryPreference
  )

  return router
} 