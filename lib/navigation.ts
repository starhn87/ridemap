import { Alert, Linking } from 'react-native';

interface NavTarget {
  name: string;
  latitude: number;
  longitude: number;
}

interface NavApp {
  label: string;
  buildUrl: (target: NavTarget) => string;
  scheme: string;
}

const NAV_APPS: NavApp[] = [
  {
    label: '카카오맵',
    scheme: 'kakaomap://',
    buildUrl: ({ name, latitude, longitude }) =>
      `kakaomap://route?ep=${latitude},${longitude}&by=CAR&ename=${encodeURIComponent(name)}`,
  },
  {
    label: 'T맵',
    scheme: 'tmap://',
    buildUrl: ({ name, latitude, longitude }) =>
      `tmap://route?goalname=${encodeURIComponent(name)}&goaly=${latitude}&goalx=${longitude}`,
  },
  {
    label: '네이버지도',
    scheme: 'nmap://',
    buildUrl: ({ name, latitude, longitude }) =>
      `nmap://route/car?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=com.ridemap.app`,
  },
  {
    label: 'Apple 지도',
    scheme: 'maps://',
    buildUrl: ({ latitude, longitude }) =>
      `maps://?daddr=${latitude},${longitude}&dirflg=d`,
  },
];

export async function openNavigation(target: NavTarget) {
  const available: NavApp[] = [];

  for (const app of NAV_APPS) {
    const canOpen = await Linking.canOpenURL(app.scheme);
    if (canOpen) {
      available.push(app);
    }
  }

  if (available.length === 0) {
    Alert.alert('알림', '설치된 네비게이션 앱이 없습니다.');
    return;
  }

  if (available.length === 1) {
    await Linking.openURL(available[0].buildUrl(target));
    return;
  }

  Alert.alert(
    '네비게이션 선택',
    '어떤 앱으로 안내할까요?',
    [
      ...available.map((app) => ({
        text: app.label,
        onPress: () => Linking.openURL(app.buildUrl(target)),
      })),
      { text: '취소', style: 'cancel' as const },
    ]
  );
}
