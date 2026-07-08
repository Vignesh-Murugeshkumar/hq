import { loginSchema, signUpSchema, forgotPasswordSchema } from '../validation';

describe('Auth Validation Schemas', () => {
  
  describe('loginSchema', () => {
    it('should validate correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'hero@healthquest.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should fail on short password', () => {
      const result = loginSchema.safeParse({
        email: 'hero@healthquest.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    it('should fail on missing values', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    it('should validate matching passwords and valid email', () => {
      const result = signUpSchema.safeParse({
        email: 'hero@healthquest.com',
        password: 'securePassword123',
        confirmPassword: 'securePassword123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when passwords do not match', () => {
      const result = signUpSchema.safeParse({
        email: 'hero@healthquest.com',
        password: 'securePassword123',
        confirmPassword: 'differentPassword',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
        expect(result.error.issues[0].path).toContain('confirmPassword');
      }
    });

    it('should fail on invalid email', () => {
      const result = signUpSchema.safeParse({
        email: 'bademail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'hero@healthquest.com',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
    });
  });

});
