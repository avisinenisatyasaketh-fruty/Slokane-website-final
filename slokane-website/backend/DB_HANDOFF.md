**Client DB Handoff**

Give them these 2 items:

1. `schema.sql`
This is now the single schema file to maintain.
Before they run it, they should replace:

`your_database_name`

with their own new empty database name.

Tables included:
- `users`
- `orders`
- `contacts`
- `subscribers`

2. `.env.example`
They should copy this to `.env` and fill in their own MySQL credentials.

**Setup steps**
- Create a new empty MySQL database
- Open `schema.sql`
- Replace `your_database_name` with the real database name
- Run `schema.sql`
- Copy `.env.example` to `.env`
- Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Set their own `JWT_SECRET` and `ADMIN_KEY`

**Notes**
- The backend already reads DB credentials from environment variables in `db.js`.
- `DB_NAME` in `.env` must match the database name they used in `schema.sql`.
- `schema.client.sql` can be kept as an optional alternative, but `schema.sql` is now the main maintained file.
