import { useState } from 'react'
import './styles/cardpay.scss'
import { useFormContext } from 'react-hook-form'

const CardPay = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [displayCard, setDisplayCard] = useState('')

  return (
    <div>
      <div className="card-payment bg-base-200! border-0! not-dark:bg-gray-400!">
        <div className="field">
          <label className="label">Credit Card Number</label>
          <input
            type="text"
            className="input"
            placeholder="1234 5678 9012 3456"
            {...register('ccNumber', {
              required: 'Credit card number is required',
            })}
            value={displayCard}
            onKeyDown={(e) => {
              // Allow only digits, backspace, and arrow keys
              if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|CtrlKey/.test(e.key)) {
                e.preventDefault()
                return
              }
              if (e.key === 'Backspace') {
                if (e.ctrlKey) {
                  if (!displayCard) {
                    return
                  }
                  const cursorPosition = e.currentTarget.selectionStart
                  const beforeCursorPosition = displayCard.slice(
                    0,
                    cursorPosition || 0,
                  )
                  const afterCursorPosition = displayCard.slice(
                    cursorPosition || 0,
                  )
                  const beforeLastSpace = beforeCursorPosition.lastIndexOf(' ')
                  if (beforeLastSpace === -1) {
                    setDisplayCard('')
                    setValue('ccNumber', '')
                  } else {
                    const newBeforeCursorPosition = beforeCursorPosition.slice(
                      0,
                      beforeLastSpace,
                    )
                    setDisplayCard(
                      newBeforeCursorPosition + afterCursorPosition,
                    )
                    setValue(
                      'ccNumber',
                      newBeforeCursorPosition.replace(' ', '') +
                        afterCursorPosition.replace(' ', ''),
                    )
                  }
                  e.preventDefault()
                } else {
                  setDisplayCard(displayCard.slice(0, -1))
                  setValue('ccNumber', displayCard.slice(0, -1))
                }
                return
              } else if (e.currentTarget.value.length > 18) {
                return
              }
              setValue('ccNumber', displayCard.replace(' ', '') + e.key)
              const formattedValue = (displayCard + e.key)
                .replace(/\D/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim()
              setDisplayCard(formattedValue)
            }}
          />
          {errors.ccNumber && (
            <span className="error">{errors.ccNumber.message as string}</span>
          )}
        </div>

        <div className="field">
          <label className="label">Expiry Date</label>
          <input
            type="text"
            className="input"
            placeholder="MM/YY"
            maxLength={5}
            inputMode="numeric"
            pattern="(?:0[1-9]|1[0-2])\/\d{2}"
            {...register('ccExpiry', {
              required: 'Expiry date is required',
              validate: (value: string) => {
                const [month, year] = value.split('/').map(Number)
                const currentYear = new Date().getFullYear() % 100 // Get last two digits of year
                const currentMonth = new Date().getMonth() + 1
                return (
                  (month >= 1 &&
                    month <= 12 &&
                    (year > currentYear ||
                      (year === currentYear && month >= currentMonth))) ||
                  'Invalid expiry date'
                )
              },
            })}
            onChange={(e) => {
              const value = e.target.value.replace(/\D+/g, '')
              const month = value.substring(0, 2)
              const year = value.substring(2, 4)
              e.target.value = `${month}${year.length ? '/' : ''}${year}`
            }}
          />
          {errors.ccExpiry && (
            <span className="error">{errors.ccExpiry.message as string}</span>
          )}
        </div>

        <div className="field">
          <label className="label">CVV</label>
          <input
            type="text"
            className="input"
            placeholder="123"
            maxLength={3}
            inputMode="numeric"
            pattern="[0-9]{3}"
            {...register('ccCvv', {
              required: 'CVV is required',
              pattern: {
                value: /^\d{3}$/,
                message: 'Invalid CVV',
              },
            })}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '')
              e.target.value = value
            }}
          />
          {errors.ccCvv && (
            <span className="error">{errors.ccCvv.message as string}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardPay
