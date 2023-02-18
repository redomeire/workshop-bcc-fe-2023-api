import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tweet from 'App/Models/Tweet'

export default class TweetsController {
    public async index({ auth, response }: HttpContextContract) {
        try {
            if (!await auth.use('api').check())
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            const tweets = await Tweet
            .query()
            .where('user_id', auth.use('api').user?.id)

            return response.ok({ status: 'success', data: tweets, message: 'success getting all tweets' })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async create({ auth, request, response }: HttpContextContract) {
        const body = request.only(['title', 'description'])

        try {
            const user = auth.use('api').user;

            if (user === undefined)
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            const newTweet = new Tweet()
            newTweet.title = body.title
            newTweet.description = body.description
            newTweet.user_id = user.id

            await newTweet.save()

            return response.ok({ status: 'success', data: newTweet, message: `success create tweeet with id ${newTweet.id}` })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async detail({ auth, request, response }: HttpContextContract) {
        const body = request.params()

        try {
            const user = auth.use('api').user;

            if (user === undefined)
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            const tweet = await Tweet
                .query()
                .where('id', body.id)
                .where('user_id', user.id)
                .first()

            return response.ok({ status: 'success', data: tweet, message: 'success getting tweet detail' })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async update({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id', 'title', 'description'])

        try {
            const user = auth.use('api').user;

            if (user === undefined)
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            const updatedTweet = await Tweet
                .query()
                .where('id', body.id)
                .where('user_id', user.id)
                .first()

            if (updatedTweet === null) return

            updatedTweet.title = body.title
            updatedTweet.description = body.description

            await updatedTweet.save()

            return response.ok({ status: 'success', data: updatedTweet, message: `success update tweeet with id ${body.id}` })
        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }

    public async delete({ auth, request, response }: HttpContextContract){
        const body = request.only(['id'])

        try {
            const user = auth.use('api').user;

            if (user === undefined)
                return response.unauthorized({ status: 'fail', message: 'unauthorized operation' })

            const deletedTweet = await Tweet
            .query()
            .where('id', body.id)
            .where('user_id', user.id)
            .first()

            if(deletedTweet === null) 
                return response.notFound({ status: 'fail', message: 'tweet not found!' })

            await deletedTweet?.delete()

            return response.ok({ status: 'success', message: 'success deleting tweet', data: deletedTweet })

        } catch (error) {
            return response.badRequest({ status: 'fail', message: error.message })
        }
    }
}
