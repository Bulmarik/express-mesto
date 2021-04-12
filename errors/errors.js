class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  NotFound,
  Forbidden,
  Conflict
};