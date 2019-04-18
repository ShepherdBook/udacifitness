import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { getMetricMetaInfo } from '../utils/helpers'

export default class AddEntry extends Component {

  state ={
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  increment(metric) {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const newCount = state[metric] + step

      return {
        ...state,
        [metric]: newCount > max ? max : newCount
      }
    })
  }

  decrement(metric) {
    const { step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const newCount = state[metric] - step

      return {
        ...state,
        [metric]: newCount < 0 ? 0 : newCount
      }
    })
  }

  slide(metric, value) {
    this.setState(() => ({
      [metric]: value
    }))
  }

  render() {
    return (
      <View>
        {getMetricMetaInfo('bike').getIcon()}
      </View>
    )
  }
}