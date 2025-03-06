export const generateMeetingId = () => {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // First character is a letter
  let id = letters[Math.floor(Math.random() * letters.length)];
  
  // Add 10 random numbers
  for (let i = 0; i < 10; i++) {
    id += numbers[Math.floor(Math.random() * numbers.length)];
  }
  
  return id;
};

export const generateAccountId = () => {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // First character is a number
  let id = numbers[Math.floor(Math.random() * numbers.length)];
  
  // Add 9 random letters
  for (let i = 0; i < 9; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  
  return id;
};

export const generatePasscode = () => {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passcode = '';
  
  // Generate 6 character passcode mixing numbers and letters
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      passcode += letters[Math.floor(Math.random() * letters.length)];
    } else {
      passcode += numbers[Math.floor(Math.random() * numbers.length)];
    }
  }
  
  return passcode;
}; 