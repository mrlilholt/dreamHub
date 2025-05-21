/**
 * Utility functions for user roles and permissions
 */

/**
 * Check if a user has admin privileges
 * @param {Object} user - The user object from Firebase Auth
 * @returns {boolean} - True if the user is an admin
 */
export const isAdmin = (user) => {
  // Admin is only alilholt@baldwinschool.org
  return user?.email === 'alilholt@baldwinschool.org';
};

/**
 * Check if a user is a student (non-admin)
 * @param {Object} user - The user object from Firebase Auth
 * @returns {boolean} - True if the user is a student
 */
export const isStudent = (user) => {
  return !!user && !isAdmin(user);
};