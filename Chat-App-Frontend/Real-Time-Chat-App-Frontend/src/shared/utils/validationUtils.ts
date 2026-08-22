export function validateEmail(email: string): string | null {
  console.log('validationUtils.validateEmail called with email:', email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('validationUtils.validateEmail: Invalid email format for:', email)
    return 'Invalid email format'
  }
  console.log('validationUtils.validateEmail: Email is valid')
  return null
}

export function validatePassword(password: string): string | null {
  console.log('validationUtils.validatePassword called with password length:', password.length)
  if (password.length < 6) {
    console.error('validationUtils.validatePassword: Password too short (less than 6 characters)')
    return 'Password must be at least 6 characters'
  }
  if (password.length > 50) {
    console.error('validationUtils.validatePassword: Password too long (more than 50 characters)')
    return 'Password must be at most 50 characters'
  }
  console.log('validationUtils.validatePassword: Password is valid')
  return null
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | null {
  console.log('validationUtils.validateConfirmPassword called with password length:', password.length, 'and confirm length:', confirm.length)
  if (password !== confirm) {
    console.error('validationUtils.validateConfirmPassword: Passwords do not match')
    return 'Passwords do not match'
  }
  console.log('validationUtils.validateConfirmPassword: Passwords match')
  return null
}

export function validateName(name: string): string | null {
  console.log('validationUtils.validateName called with name:', name)
  if (name.length < 2) {
    console.error('validationUtils.validateName: Name too short (less than 2 characters)')
    return 'Name must be at least 2 characters'
  }
  if (name.length > 50) {
    console.error('validationUtils.validateName: Name too long (more than 50 characters)')
    return 'Name must be at most 50 characters'
  }
  console.log('validationUtils.validateName: Name is valid')
  return null
}

export function validateOtp(otp: string): string | null {
  console.log('validationUtils.validateOtp called with otp:', otp)
  if (!/^\d{6}$/.test(otp)) {
    console.error('validationUtils.validateOtp: Invalid OTP format (must be 6 digits)')
    return 'OTP must be 6 digits'
  }
  console.log('validationUtils.validateOtp: OTP is valid')
  return null
}

export function validateGroupName(name: string): string | null {
  console.log('validationUtils.validateGroupName called with name:', name)
  if (name.length < 3) {
    console.error('validationUtils.validateGroupName: Group name too short (less than 3 characters)')
    return 'Group name must be at least 3 characters'
  }
  if (name.length > 50) {
    console.error('validationUtils.validateGroupName: Group name too long (more than 50 characters)')
    return 'Group name must be at most 50 characters'
  }
  console.log('validationUtils.validateGroupName: Group name is valid')
  return null
}

export function validateBio(bio: string): string | null {
  console.log('validationUtils.validateBio called with bio length:', bio.length)
  if (bio.length > 500) {
    console.error('validationUtils.validateBio: Bio too long (more than 500 characters)')
    return 'Bio must be at most 500 characters'
  }
  console.log('validationUtils.validateBio: Bio is valid')
  return null
}