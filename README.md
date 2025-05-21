# Test pgsync

## Install

```shell
# Install dependencies
$ sudo apt update
$ sudo apt install -y ruby-dev build-essential libpq-dev postgresql-client

# Install pgsync using gem
$ gem install pgsync

# Or install via Homebrew (on macOS or Linuxbrew)
$ brew install pgsync

# For more details, see: https://github.com/ankane/pgsync/tree/master
```

## Generate dummy data

``` shell
$ cd dummy_data && npm install

# Generate dummy CSV data for PostgreSQL import
$ node generate_csv.js
```

## Run
```shell
# Start the PostgreSQL and related services
$ docker compose up

$ cd demo/<action>

# Sync data using pgsync (defer constraints for faster import)
$ pgsync account_data --defer-constraints
```

## Remove Data
```shell
$ sudo rm -rf data data2 dummy_data/data
```
