// firebaseErrorCodes.ts

// Firebase error codes object
export const FirebaseErrorCodes: { [key in string]: string } = {
  'auth/invalid-email': 'The email address is badly formatted.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/user-not-found': 'No user found for this email address.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email address is already in use by another account.',
  'auth/weak-password': 'The password is too weak.',
  'auth/too-many-requests': 'Too many requests. Please try again later.',
  'auth/account-exists-with-different-credential': 'Account exists with a different sign-in method.',
  'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
  'firestore/permission-denied': 'You do not have permission to perform this operation.',
  'firestore/unavailable': 'The service is currently unavailable.',
  'firestore/invalid-argument': 'Invalid argument provided.',
  'firestore/not-found': 'The requested document or collection could not be found.',
  'firestore/aborted': 'The operation was aborted.',
  'firestore/failed-precondition': 'The operation failed due to a precondition failure.',
  'database/permission-denied': 'Permission denied for the requested database operation.',
  'database/disconnected': 'Disconnected from the database. Please try again.',
  'database/overloaded': 'The database is currently overloaded.',
  'database/too-many-requests': 'Too many requests to the database. Please try again later.',
  'storage/canceled': 'The upload or download operation was canceled.',
  'storage/unknown': 'An unknown storage error occurred.',
  'storage/unauthorized': 'Unauthorized access to the storage.',
  'storage/invalid-argument': 'Invalid argument for the storage operation.',
};

// Function to get the error message based on the error code
export function getErrorMessage(errorCode: string): string {
  return FirebaseErrorCodes[errorCode] || 'An unexpected error occurred.';
}
