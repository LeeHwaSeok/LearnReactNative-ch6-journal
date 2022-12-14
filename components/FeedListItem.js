import {useNavigation} from '@react-navigation/native';
import {format, formatDistanceToNow} from 'date-fns';
import {ko} from 'date-fns/locale';
import React from 'react';
import {Platform, Pressable, StyleSheet, Text} from 'react-native';

//인스타처럼 날짜 쓰기 ~> 방금 전, 1시간 전 etc...
function formatDate(date) {
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;

  if (diff < 60 * 1 && diff > 0) {
    return '방금 전';
  }
  if (diff < 60 * 60 * 24 * 3) {
    return formatDistanceToNow(d, {addSuffix: true, locale: ko});
  }
  // ppp : 날자 / EEE : 요일 / p : 시간
  return format(d, 'PPP EEE p', {locale: ko});
}

//정규식 사용으로 줄 바꿈 문자 제거
function truncate(text) {
  const replaced = text.replace(/\n/g, ' ');
  if (replaced.length <= 100) {
    return replaced;
  }
  return replaced.slice(0, 100).concat('...');
}

function FeedListItem({log}) {
  const {title, body, date} = log; //객체를 분할할당 python 처럼 쓰면 됨

  //(modify)데이터 수정을 위한 기능 => Write
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('Write', {
      log,
    });
  };

  return (
    <Pressable
      //Pressable에서는 눌려진 상태를 pressed로 사용한다.
      //현재 항목을 눌렸을 때의 반응이다.
      style={({pressed}) => [
        styles.block,
        Platform.OS === 'ios' && pressed && {backgroundColor: '#efefef'},
      ]}
      android_ripple={{color: '#ededed'}}
      onPress={onPress}>
      <Text style={styles.date}>{formatDate(date)}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{truncate(body)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  date: {
    fontSize: 12,
    color: '#546e7a',
    marginBottom: 8,
  },
  title: {
    color: '#263238',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    color: '#37474f',
    fontSize: 16,
    lineHeight: 21,
  },
});

export default FeedListItem;
