import bcrypt from 'bcrypt';
const saltRounds = 10;
export async function hashPassword(plainPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

// Hàm kiểm tra mật khẩu
export async function comparePassword(plainPassword: string, hashedPassword: string) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

export async function isLogin(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const isPasswordValid = await comparePassword(plainPassword, hashedPassword);
  return isPasswordValid;
}