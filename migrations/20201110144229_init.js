
exports.up = function(knex) {
  return knex.schema
  .createTables("users", tbl => {

    tbl.increments();
    tbl.string("username").notNullable().unique();
    tbl.string("password").notNullable().unique();
    tbl.string("department")
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists("users")
};
