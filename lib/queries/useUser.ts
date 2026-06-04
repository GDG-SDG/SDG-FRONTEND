// 사용자 조회/변경 훅 — TanStack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  getMypage,
  getMypageSummary,
  getNotificationSettings,
  updateMypage,
  updateNotificationSettings,
  updatePassword,
} from "@/lib/api/user";
import { queryKeys } from "./keys";

/** 내 정보 */
export function useMypage() {
  return useQuery({
    queryKey: queryKeys.mypage,
    queryFn: getMypage,
  });
}

/** 마이페이지 통계 */
export function useMypageSummary() {
  return useQuery({
    queryKey: queryKeys.mypageSummary,
    queryFn: getMypageSummary,
  });
}

/** 알림 설정 조회 */
export function useNotificationSettings() {
  return useQuery({
    queryKey: queryKeys.notificationSettings,
    queryFn: getNotificationSettings,
  });
}

/** 알림 설정 수정 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationSettings,
      }),
  });
}

/** 내 정보 수정 */
export function useUpdateMypage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMypage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.mypage }),
  });
}

/** 비밀번호 변경 */
export function useUpdatePassword() {
  return useMutation({ mutationFn: updatePassword });
}

/** 회원 탈퇴 */
export function useDeleteUser() {
  return useMutation({ mutationFn: deleteUser });
}
