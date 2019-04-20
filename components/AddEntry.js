import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { getMetricMetaInfo, timeToString, GetDailyReminderValue } from '../utils/helpers'
import UdaciSlider from "./UdaciSlider";
import UdaciSteppers from "./UdaciSteppers";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from "react-redux";
import { addEntry } from "../actions";

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
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

  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]: entry
    }))

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }))

    // Navigate to home

    submitEntry(key, entry)

    // Clear local notification
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]: GetDailyReminderValue()
    }))
    // Route to home

    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name='ios-happy' size={100}/>
          <Text>You already logged your information today</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        
        <Text>{JSON.stringify(this.state)}</Text>

        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider 
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                  />
              }
            </View>
          )
        })}

        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

function mapStateToProps (state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined' // entry for today exists in state AND today's daily reminder is undefined
  }
}

export default connect(mapStateToProps)(AddEntry)