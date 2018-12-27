"use strict"

const Contact = use("App/Models/Contact")
const User = use("App/Models/User")
const Starred = use("App/Models/Starred")
const { validate } = use("Validator")

class ContactController {
  async index({ request, response, auth }) {
    try {
      const user = await User.find(auth.user.id)
      const contacts = await user.contacts().fetch()

      response.json(contacts)
    } catch (err) {
      return response.status(400).json({
        status: "error",
        message: "Resource not found"
      })
    }
  }

  async store({ request, response, auth }) {
    //validate form input
    const validation = await validate(request.all(), {
      fullname: "required",
      email: "required|email",
      telephone: "required",
      address: "required"
    })

    //show error messages upon validation fail
    if (validation.fails()) {
      return response.send(validation.messages())
    }

    try {
      const parameter = request.only([
        "fullname",
        "email",
        "telephone",
        "address"
      ])

      const contact = new Contact()
      contact.fullname = parameter.fullname
      contact.email = parameter.email
      contact.telephone = parameter.telephone
      contact.address = parameter.address
      contact.user_id = auth.user.id

      await contact.save()

      return response.status(201).json({
        message: "Contact created successfully",
        data: contact
      })
    } catch (err) {
      return response.status(400).json({
        status: "error",
        message: "Could not create contact"
      })
    }
  }

  async show({ params, request, response, auth }) {
    const contact = await Contact.find(params.id)

    if (!contact) {
      return response.status(404).json({ data: "Resource not found" })
    }

    return response.json(contact)
  }

  async update({ params, request, response }) {
    const parameter = request.only([
      "fullname",
      "email",
      "telephone",
      "address"
    ])
    const contact = await Contact.find(params.id)

    try {
      contact.address = parameter.address
      contact.email = parameter.email
      contact.telephone = parameter.telephone
      contact.fullname = parameter.fullname

      await contact.save()

      return response.status(201).json({
        message: "Updated successfully",
        data: contact
      })
    } catch (err) {
      return response.status(400).json({
        status: "error",
        message: "Could not update contact"
      })
    }
  }

  async destroy({ params, request, response }) {
    const contact = await Contact.find(params.id)

    if (!contact) {
      return response.status(404).json({
        data: "Contact not found"
      })
    }
    await contact.delete()

    return response.status(201).json({ data: "Deleted successfully" })
  }

  async starContact({ params, response, auth }) {
    // return params.id
    try {
      const starContact = new Starred()
      starContact.user_id = auth.user.id
      starContact.contact_id = params.id
      await starContact.save()

      return response.json({
        message: "Contact starred successfully"
      })
    } catch (err) {
      return response.status(400).json({
        status: "error",
        message: "Could not star contact"
      })
    }
  }

  async starredContacts({ response, auth }) {
    try {
      const user = await User.find(auth.user.id)
      const star = await Starred.query()
        .innerJoin("contacts", "starreds.contact_id", "contacts.id")
        .innerJoin("users", "contacts.user_id", "users.id")
        .select(
          "users.username",
          "contacts.fullname",
          "contacts.address",
          "contacts.email",
          "contacts.telephone"
        )
        .where("starreds.user_id", user.id)
        .fetch()
      return response.json(star)
    } catch (err) {
      return response.status(400).json({
        status: "error",
        message: "Resource not found"
      })
    }
  }
}

module.exports = ContactController
