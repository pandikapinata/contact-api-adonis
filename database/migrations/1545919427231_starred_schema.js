'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StarredSchema extends Schema {
  up () {
    this.create('starreds', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.integer('contact_id').unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('starreds')
  }
}

module.exports = StarredSchema
