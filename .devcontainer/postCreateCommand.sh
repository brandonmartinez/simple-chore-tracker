#!/bin/bash

# Initialize PostgreSQL with the specified user and database
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;"

# Run database migrations
npx knex migrate:latest --knexfile /workspaces/simple-chore-tracker/knexfile.cjs
