import { message } from 'antd'
import BigNumber from 'bignumber.js'
import copyThat from 'copy-to-clipboard'
import { format, isValid, parseISO } from 'date-fns/fp'
import { BigNumber as BN, BigNumberish, utils } from 'ethers'
import { identity } from 'lodash'
import { flow, trimCharsEnd } from 'lodash/fp'
import React, { ReactNode } from 'react'
import type { useBalance } from 'wagmi'

export const datetime =
  ({ formatter = 'yyyy-MM-dd HH:mm:ss', defaultDisplay = '--', parse = parseISO } = {}) =>
  (value: number | Date | string): string => {
    try {
      const dateValue = typeof value === 'string' ? parse(value) : value
      if (isValid(dateValue)) {
        return format(formatter)(dateValue)
      }
      return defaultDisplay
    } catch (e) {
      console.warn(e)
      return defaultDisplay
    }
  }
function getFullNum(num: string | number) {
  const str = `${num}`
  if (!/e/i.test(str)) {
    return str
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.?0+$/, '')
}

export const date = ({ formatter = 'yyyy-MM-dd', defaultDisplay = '--', parse = parseISO } = {}) =>
  datetime({ formatter, defaultDisplay, parse })

type UseBalance = ReturnType<typeof useBalance>

export const getFixedCoin = (value: number | string) => {
  const stringValue = getFullNum(value)

  const matches =
    Number(stringValue) > 1 ? stringValue.match(/^-?\d+(?:\.\d{0,2})?/) : stringValue.match(/^-?\d+(?:\.\d{0,5})?/)
  if (matches) {
    return matches[0]
  }
  return stringValue
}

export const addComma = (value?: string) => {
  if (value) {
    const [integer, digit] = value.split('.')
    const finalInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const finalDigit = trimCharsEnd('0')(digit)
    if (finalDigit) {
      return `${finalInteger}.${finalDigit}`
    }
    return finalInteger
  }
  return value
}

export const parseCoin = (value?: string) => value?.replace(/\$\s?|(,*)/g, '') || ''

export const formatCoin = (value?: string) => {
  if (value) {
    const [integer, digit] = value.split('.')
    const finalInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    if (digit !== undefined) {
      return `${finalInteger}.${digit}`
    }
    return finalInteger
  }

  return ''
}

export const getCoinDisplay = (
  number: BigNumberish | number | string | undefined | null | BigNumber,
  decimals?: number
) => {
  if (number === null || number === undefined) {
    return '--'
  }
  if (number === '0' || number === 0) {
    return '0.00'
  }
  return flow(
    decimals === undefined ? identity : (value) => utils.formatUnits(value, decimals),
    getFixedCoin,
    formatCoin
  )(number.toString())
}
export const getBalanceDisplay = ({
  isSuccess,
  data,
}: {
  isSuccess: UseBalance['isSuccess']
  data: UseBalance['data']
}) => {
  if (isSuccess && data?.formatted) {
    return getCoinDisplay(data.formatted)
  }
  return '--'
}

export const percentage =
  ({ digit = 2, symbol = '%', defaultDisplay = '--', decimals = 0 } = {}) =>
  (value?: number | bigint | BigNumber | BigNumberish): string => {
    if (value === undefined) {
      return defaultDisplay
    }
    let bigNumber = new BigNumber(value.toString())
    if (bigNumber.isNaN()) {
      return defaultDisplay
    }
    if (decimals) {
      bigNumber = bigNumber.div(10 ** decimals)
    }
    return `${bigNumber.multipliedBy(10 ** digit).decimalPlaces(digit)}${symbol}`
  }

export const ellipsis =
  ({ startLength = 4, endLength = 4, placeholder = '...', defaultDisplay = '--' } = {}) =>
  (value?: string): string => {
    if (!value) {
      return defaultDisplay
    }
    if (value.length <= startLength + endLength) {
      return value
    }
    return `${value.slice(0, startLength)}${placeholder}${value.slice(value.length - endLength, value.length)}`
  }

export const msInSecond = 1000
export const msInMinute = msInSecond * 60
export const msInHour = msInMinute * 60
export const msInDay = msInHour * 24

export const getDurationDisplay = (target: string, source: string) => {
  const durationMS = Math.abs(new Date(target).getTime() - new Date(source).getTime())
  if (durationMS > msInDay) {
    return `${Math.floor(durationMS / msInDay)}d`
  }
  if (durationMS > msInHour) {
    return `${Math.floor(durationMS / msInHour)}h`
  }
  if (durationMS > msInMinute) {
    return `${Math.floor(durationMS / msInMinute)}m`
  }
  return `${Math.floor(durationMS / msInSecond)}s`
}

export const copyMsg = (text: string, tips: string) => {
  copyThat(text.replace(/\s*/g, ''))
  message.success(tips)
}

export const spanChunkValues = {
  span: (chunks: ReactNode[]) => <span>{chunks}</span>,
}
export const formatAmountByApi = (value: string) => {
  if (!value) {
    return '0'
  }
  return new BigNumber(value).div(10 ** 18).toString()
}
