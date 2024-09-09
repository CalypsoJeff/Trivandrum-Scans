import * as bcrypt from "bcrypt";

export const Encrypt = {
  cryptPassword: (password: string): Promise<string> => {
    return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
  },

  comparePassword: (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },
};
