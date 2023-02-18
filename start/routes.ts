/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.post('/register', 'AuthController.register')
      Route.post('/login', 'AuthController.login')
      Route.post('/logout', 'AuthController.logout')
    }).prefix('auth')

    Route.group(() => {
      Route.get('/all', 'TweetsController.index').middleware('auth')
      Route.get('/:id/detail', 'TweetsController.detail').middleware('auth')
      Route.post('/create', 'TweetsController.create').middleware('auth')
      Route.put('/update', 'TweetsController.update').middleware('auth')
      Route.delete('/delete', 'TweetsController.delete').middleware('auth')
    }).prefix('tweet')

  }).prefix('v1')
  
}).prefix('api')

Route.get('/users', () => {
  const users = [
    {
      name: 'redo',
      id: 1
    },
    {
      name: 'redo',
      id: 1
    },
    {
      name: 'redo',
      id: 1
    }
  ]
  return { data: users }
})
