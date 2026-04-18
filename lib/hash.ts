import bcrypt from "bcrypt";

// enkripsi password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
