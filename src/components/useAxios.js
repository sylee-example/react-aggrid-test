import { useState, useCallback } from "react";
import axios from "axios";

/**
 * 공통으로 사용할 Axios 인스턴스 설정
 */
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // 프로젝트의 API Base URL로 변경하세요.
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * 공통 실행 함수
   */
  const execute = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "알 수 없는 에러가 발생했습니다.";
      setError(errorMessage);
      // 호출부(컴포넌트)의 try-catch에서 처리할 수 있도록 에러를 다시 던집니다.
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // HTTP 메서드별 편의 함수
  const get = useCallback(
    (url, config = {}) => execute({ ...config, method: "GET", url }),
    [execute]
  );

  const post = useCallback(
    (url, data, config = {}) =>
      execute({ ...config, method: "POST", url, data }),
    [execute]
  );

  const put = useCallback(
    (url, data, config = {}) =>
      execute({ ...config, method: "PUT", url, data }),
    [execute]
  );

  const del = useCallback(
    (url, config = {}) => execute({ ...config, method: "DELETE", url }),
    [execute]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, get, post, put, del, reset };
};

export default useAxios;
