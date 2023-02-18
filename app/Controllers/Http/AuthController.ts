import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
    public async register({ auth, request, response }: HttpContextContract){
        const body = request.only(['email', 'password'])

        try {
            if(await auth.use('api').check())
                return response.badRequest({ status: 'fail', message: 'you need to logout first!' })

            const newUser = new User()
            newUser.email = body.email
            newUser.password = body.password

            await newUser.save()

            return response.ok({ status: 'success', message: 'success creating new account!' })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async login({ auth, request, response }: HttpContextContract){
        const body = request.only(['email', 'password'])

        try {
            if(await auth.use('api').check())
                return response.badRequest({ status: 'fail', message: 'you need to logout first!' })

            const token = await auth.use('api').attempt(body.email, body.password)

            return response.ok({ status: 'success', message: 'success creating new account!', token: token })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async logout({ auth, response }: HttpContextContract){
        try {
            if(!await auth.use('api').check())
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            await auth.use('api').revoke()

            return response.ok({ status: 'success', message: 'success logout!' })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }
}
