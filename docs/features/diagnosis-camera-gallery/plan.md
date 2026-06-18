# diagnosis-camera-gallery

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #22 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/22 |
| Branch       | feature/22-diagnosis-camera-gallery                     |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-17                                              |
| Type         | Feat                                                    |

## 🎯 작업 목적

실제 기기에서 사용할 수 있도록 진단 화면에서 mock 이미지 대신 실제 갤러리 접근 및 카메라 연동이 가능하게 한다.

## 📋 작업 범위

**포함 (In Scope)**

- [ ] 갤러리 버튼 → 사진 선택
- [ ] 촬영 버튼 → 카메라 실행
- [ ] 선택·촬영한 이미지로 분석 흐름 연결

**제외 (Out of Scope)**

- 없음

## 🛠️ 접근 방식

- `<input type="file" accept="image/*">` 로 갤러리 사진 선택
- `<input type="file" accept="image/*" capture="environment">` 로 카메라 촬영
- 선택/촬영한 파일을 `URL.createObjectURL` 또는 FileReader로 미리보기 → 기존 `captured` → `analyzing` → `complete` stage 흐름 재사용
- 카메라 버튼·갤러리 버튼 각각 별도 hidden input ref로 트리거
- 컴포넌트 unmount 시 objectURL revoke로 메모리 누수 방지

## 🔗 참고 자료

| 유형      | 링크 |
| --------- | ---- |
| Figma     | -    |
| Storybook | -    |
| API 명세  | -    |
| 기타      | -    |

## 🤔 주요 결정 사항

<!-- /note 또는 수동으로 추가 -->
