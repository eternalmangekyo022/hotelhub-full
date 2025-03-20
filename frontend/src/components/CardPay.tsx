import React from 'react';
import './styles/cardpay.scss';
import { useForm } from 'react-hook-form';

const CardPay = ({ register, errors, isRequired }) => {
    const { handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    // Function to format the credit card number
    const formatCreditCardNumber = (value) => {
        return value
            .replace(/\D/g, '') // Remove non-digits
            .replace(/(\d{4})/g, '$1 ') // Add space every 4 digits
            .trim(); // Remove trailing space
    };

    // Function to handle credit card input changes
    const handleCreditCardInputChange = (e) => {
        const formattedValue = formatCreditCardNumber(e.target.value);
        e.target.value = formattedValue;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-payment">
                <div className="field">
                    <label className="label">Credit Card Number</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19} // 16 digits + 3 spaces
                        onKeyDown={(e) => {
                            // Allow only digits, backspace, and arrow keys
                            if (!/[0-9]|Backspace|ArrowLeft|ArrowRight/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onInput={handleCreditCardInputChange}
                        {...register('ccNumber', {
                            required: isRequired ? 'Credit card number is required' : false,
                            pattern: {
                                value: /^\d{4} \d{4} \d{4} \d{4}$/, // Validate format
                                message: 'Invalid credit card number',
                            },
                        })}
                    />
                    {errors.ccNumber && (
                        <span className="error">{errors.ccNumber.message}</span>
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
                            required: isRequired ? 'Expiry date is required' : false,
                            validate: (value) => {
                                const [month, year] = value.split('/').map(Number);
                                const currentYear = new Date().getFullYear() % 100; // Get last two digits of year
                                const currentMonth = new Date().getMonth() + 1;
                                return (
                                    (month >= 1 && month <= 12) &&
                                    (year > currentYear || (year === currentYear && month >= currentMonth))
                                ) || 'Invalid expiry date';
                            },
                        })}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D+/g, '');
                            const month = value.substring(0, 2);
                            const year = value.substring(2, 4);
                            e.target.value = `${month}${year.length ? '/' : ''}${year}`;
                        }}
                    />
                    {errors.ccExpiry && (
                        <span className="error">{errors.ccExpiry.message}</span>
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
                            required: isRequired ? 'CVV is required' : false,
                            pattern: {
                                value: /^\d{3}$/,
                                message: 'Invalid CVV',
                            },
                        })}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            e.target.value = value;
                        }}
                    />
                    {errors.ccCvv && (
                        <span className="error">{errors.ccCvv.message}</span>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CardPay;