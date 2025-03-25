import { FormEventHandler } from 'react'
import { UseFormSetValue, UseFormRegister } from 'react-hook-form'

export type ISetValue = UseFormSetValue<{
  location: string
  price: [number, number]
  payment: {
    card: boolean
    cash: boolean
  }
  rating: [number, number]
  searchQuery: string
}>
export type IRegister = UseFormRegister<{
  location: string
  price: [number, number]
  payment: {
    card: boolean
    cash: boolean
  }
  rating: [number, number]
  searchQuery: string
}>
export interface IHandleSubmit {
  (
    onValid: (data: {
      location: string
      price: [number, number]
      payment: {
        card: boolean
        cash: boolean
      }
      rating: [number, number]
      searchQuery: string
    }) => void,
  ): FormEventHandler<HTMLFormElement>
}
export type ISortMode = 'asc' | 'desc'
