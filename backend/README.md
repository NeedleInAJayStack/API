# API

This is Jay's API for different datasets. It requires a Timescale DB instance.

## Getting Started

Create a `.env` file in this directory that contains necessary environment variables. For example:

```
USERNAME=<username>
PASSWORD=<password>

DATABASE_HOST=<host>
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=<name>
```

## Future work

- Add web-app to easily input data values
- Add session authentication: https://docs.vapor.codes/4.0/authentication/#session
- Change to GraphQL?
- Consider aligning timestamp format (ISO8601 vs epoch)
