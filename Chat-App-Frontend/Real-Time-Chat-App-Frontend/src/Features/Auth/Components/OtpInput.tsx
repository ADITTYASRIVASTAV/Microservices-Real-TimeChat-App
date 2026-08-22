import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  disabled?: boolean
  error?: string | null
}

const OtpInput = ({ value, onChange, disabled = false, error = null }: OtpInputProps) => {
  console.log('OtpInput rendered with value:', value, 'disabled:', disabled, 'error:', error)
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array(6).fill('')
    value.split('').forEach((char, index) => {
      if (index < 6) arr[index] = char
    })
    return arr
  })
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    console.log('OtpInput useEffect: value changed to', value)
    const arr = Array(6).fill('')
    value.split('').forEach((char, index) => {
      if (index < 6) arr[index] = char
    })
    setDigits(arr)
  }, [value])

  const updateOtp = (newDigits: string[]) => {
    const otp = newDigits.join('')
    console.log('OtpInput updateOtp called with newDigits:', newDigits, 'otp:', otp)
    onChange(otp)
  }

  const handleChange = (index: number, input: string) => {
    console.log(`OtpInput handleChange index ${index} input:`, input)
    if (!/^\d*$/.test(input)) return // only numbers

    const newDigits = [...digits]
    newDigits[index] = input.slice(0, 1)
    setDigits(newDigits)
    updateOtp(newDigits)

    if (input && index < 5) {
      console.log(`OtpInput: moving focus to index ${index + 1}`)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      console.log(`OtpInput: backspace on empty input, moving focus to index ${index - 1}`)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    console.log('OtpInput handlePaste pastedData:', pastedData)
    if (/^\d{6}$/.test(pastedData)) {
      const arr = pastedData.split('')
      setDigits(arr)
      updateOtp(arr)
      inputRefs.current[5]?.focus()
    } else {
      console.warn('OtpInput: pasted data is not 6 digits')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        className="flex gap-2 justify-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {digits.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`h-12 w-12 rounded-md border text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : digit
                ? 'border-gray-300 bg-blue-50 dark:bg-gray-800 dark:border-gray-600'
                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          />
        ))}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default OtpInput
