# RideMap 구현 계획

바이커 전용 지도/네비게이션 앱

## 기술 스택

- **Mobile**: React Native (Expo) + TypeScript
- **지도**: Mapbox GL + 카카오 로컬 API (장소 검색 보조)
- **백엔드**: Supabase (PostgreSQL + PostGIS, Auth, Storage, Realtime)
- **상태관리**: Zustand + TanStack Query
- **UI/UX**: Nativewind (Tailwind), Reanimated, Gesture Handler, Moti
- **CI/CD**: EAS Build + EAS Update (OTA), GitHub Actions

## MVP (v1.0)

- [x] 지도 뷰 + 바이커 POI 표시
- [x] 카테고리 필터 (카페, 맛집, 휴게소, 주유소, 정비소, 뷰포인트)
- [x] 장소 상세 (바텀시트)
- [ ] Supabase 연동 (DB + Auth)
- [ ] 소셜 로그인 (카카오, 애플)
- [ ] 장소 제보 (크라우드소싱: 제보 → 검증 → 반영)
- [ ] 네비게이션 (경로 안내)

## v1.1

- [ ] 라이딩 추천 코스 목록 + 미리보기
- [ ] 장소 리뷰/평점
- [ ] 즐겨찾기 (장소, 코스 저장)

## v1.2+

- [ ] 코스 공유 (내 라이딩 기록을 코스로 공유)
- [ ] 실시간 정보 (도로 상태, 날씨, 단속 카메라)
- [ ] 커뮤니티 (모임 모집, 피드)

## 디자인

- 다크모드 기본, 라이트모드 전환 지원
- 브랜드 컬러: 오렌지 (#F97316)
- 라이딩 중 눈이 편한 UI

## 크라우드소싱 전략

1. **Phase 1 (런칭 초기)**: 시드 데이터 50~100개 직접 등록 + 유저 제보 (수동 검증)
2. **Phase 2 (유저 확보 후)**: 신뢰 유저에게 검증자 권한 부여, N명 추천 시 자동 승인
3. **Phase 3 (스케일)**: 사진 + 위치 기반 중복 자동 감지, 리뷰/방문 수 기반 품질 관리

## 타겟

- 1차: 바이커 (오토바이)
- 2차: 자전거 라이더 (추후 확장)
