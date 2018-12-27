"use strict"

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route")

Route.group(() => {
  Route.post("users/signup", "UserController.signup")
  Route.post("users/signin", "UserController.signin")
}).prefix("api")

Route.group(() => {
  Route.get("contacts", "ContactController.index")
  Route.get("contact/:id", "ContactController.show")
  Route.post("contact", "ContactController.store")
  Route.put("contacts/:id", "ContactController.update")
  Route.delete("contacts/:id", "ContactController.destroy")
  Route.post("contacts/:id/star", "ContactController.starContact")
  Route.get("starred/contacts", "ContactController.starredContacts")
}).prefix("api").middleware(['auth'])
