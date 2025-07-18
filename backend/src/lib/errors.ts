export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  public errors: any;
  constructor(errors: any) {
    super('Invalid data provided');
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message);
  }
} 