import bcrypt from "bcrypt";

// enkripsi password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  // if (!isMatch) {
  //   logger.error('Compare Password Result:Password does not match')
  // }

  return isMatch;
};
