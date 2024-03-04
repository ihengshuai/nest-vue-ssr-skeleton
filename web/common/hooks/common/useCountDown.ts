import dayjs from "dayjs";
import { ref } from "vue";

export function useCountDown(endDate: any, doneCb?: () => any) {
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  const done = ref(false);

  function showTime(time: number) {
    const start = dayjs(new Date()); // 获取开始时间
    const end = dayjs(new Date(time)); // 结束时间
    const diff = end.diff(start); // 时间差
    if (diff <= 0) {
      done.value = true;
      doneCb && typeof doneCb === "function" && doneCb?.();
    }
    if (done.value) return;
    var timediff = Math.round(diff / 1000);
    // 获取还剩多少天
    var day = parseInt((timediff / 3600 / 24) as unknown as string);
    // 获取还剩多少小时
    var hour = parseInt(((timediff / 3600) % 24) as unknown as string);
    // 获取还剩多少分钟
    var minute = parseInt(((timediff / 60) % 60) as unknown as string);
    // 获取还剩多少秒
    var second = timediff % 60;
    // 给小于10的数值前面加 0
    days.value = day;
    hours.value = hour;
    minutes.value = minute;
    seconds.value = second;
    window.requestAnimationFrame(() => {
      showTime(time);
    });
  }

  if (__isBrowser__) {
    showTime(endDate);
  }
  return {
    days,
    hours,
    minutes,
    seconds,
    done
  };
};
