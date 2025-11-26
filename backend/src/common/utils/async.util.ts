/**
 * 지정된 시간만큼 지연시키는 함수
 * @param ms 지연 시간 (밀리초)
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 타임아웃과 함께 Promise를 실행하는 함수
 * @param promise 실행할 Promise
 * @param timeoutMs 타임아웃 시간 (밀리초)
 * @param errorMessage 타임아웃 시 에러 메시지
 * @returns Promise<T>
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = '요청 시간이 초과되었습니다.',
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * 재시도 로직이 포함된 Promise 실행 함수
 * @param fn 실행할 함수
 * @param maxRetries 최대 재시도 횟수
 * @param delayMs 재시도 간격 (밀리초)
 * @returns Promise<T>
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i === maxRetries) {
        throw lastError;
      }

      await sleep(delayMs);
    }
  }

  throw lastError!;
}
