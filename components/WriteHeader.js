import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import React, {useReducer, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const initialState = {mode: 'date', visible: false};

function reducer(state, action) {
  switch (action.type) {
    case 'open':
      return {
        mode: action.mode,
        visible: true,
      };
    case 'close':
      return {
        ...state,
        visible: false,
      };
    default:
      throw new Error('unhandled action type');
  }
}

function WriteHeader({onSave, onAskRemove, isEditing, date, onChangeDate}) {
  const naviagtion = useNavigation();
  const onGoBack = () => {
    naviagtion.pop();
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const open = mode => dispatch({type: 'open', mode});
  const close = () => dispatch({type: 'close'});

  const onConfirm = selectedDate => {
    close();
    onChangeDate(selectedDate);
  };

  return (
    <View style={styles.block}>
      <View style={styles.iconButtonWrapper}>
        <TransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>
      <View style={styles.buttons}>
        {isEditing && (
          <TransparentCircleButton
            hasMarginRight
            name="delete-forever"
            color="#ef5350"
            onPress={onAskRemove}
          />
        )}
        <TransparentCircleButton
          name="check"
          onPress={onSave}
          color="#009688"
        />
      </View>
      <View style={styles.center}>
        <Pressable onPress={() => open('date')}>
          <Text style={StyleSheet.create({fontSize: 18, color: '#2e8b57'})}>
            {format(new Date(date), 'PPP', {locale: ko})}
          </Text>
        </Pressable>
        <View style={styles.separator} />
        <Pressable onPress={() => open('time')}>
          <Text style={StyleSheet.create({fontSize: 17, color: '#3cb371'})}>
            {format(new Date(date), 'p', {locale: ko})}
          </Text>
        </Pressable>
      </View>
      <DateTimePickerModal
        isVisible={state.visible}
        mode={state.mode}
        onConfirm={onConfirm}
        onCancel={close}
        date={date}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    height: 48,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    flexDirection: 'row',
  },
  separator: {
    width: 8,
  },
});

export default WriteHeader;
