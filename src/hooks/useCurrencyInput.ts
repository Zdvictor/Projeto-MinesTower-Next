'use client'

export function useCurrencyInput(
  value: number,
  onChange: (value: number) => void
) {
  const formatToCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const parseLocaleNumber = (stringValue: string): number => {
    const cleanValue = stringValue.replace(/[^0-9]/g, '')
    return Number(cleanValue) / 100
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '')
    
    // Converte para número (considerando os centavos)
    const floatValue = Number(numericValue) / 100
    
    // Chama o callback com o novo valor
    onChange(floatValue)
  }

  const formattedValue = value ? formatToCurrency(value) : ''

  return {
    formattedValue,
    handleChange
  }
} 