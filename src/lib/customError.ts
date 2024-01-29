type CustomErrorMessage = {
  name: string;
  message: string;
  status: number;
};

export class CustomError extends Error {
  status: number;

  constructor({ name, message, status }: CustomErrorMessage) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
