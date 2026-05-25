import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Alert, List, Modal, Input, Space } from "antd";
import useAxios from "../hooks/useAxios";

const AxiosSample = () => {
  // 개선된 커스텀 훅 사용 (get, post 등 추출)
  const { data, error, loading, get, post } = useAxios();
  // 입력 데이터 상태 관리
  const [postTitle, setPostTitle] = useState("");

  // GET 요청 함수
  const fetchPosts = () => {
    get("/posts", {
      params: { _limit: 5 }, // 5개만 가져오기
    }).catch(() => {
      // 에러 처리는 execute 내부에서 수행하지만,
      // 컴포넌트 레벨에서 추가 로직이 필요할 경우 catch를 사용합니다.
    });
  };

  // POST 요청 함수 예시
  const createPost = async () => {
    if (!postTitle.trim()) {
      Modal.warning({ title: "알림", content: "내용을 입력해주세요." });
      return;
    }

    try {
      // API 호출
      await post("/posts", {
        title: postTitle,
        body: "사용자 입력 내용입니다.",
        userId: 1,
      });

      // 성공 시 처리
      Modal.success({
        title: "등록 완료",
        content: "성공적으로 등록되었습니다!",
      });
      setPostTitle(""); // 성공 시에만 입력 필드 초기화
    } catch (err) {
      // 에러 발생 시 처리
      // catch 문으로 들어오기 때문에 setPostTitle("")이 실행되지 않아 입력 데이터가 유지됩니다.
      Modal.error({
        title: "서버 오류 발생",
        content:
          "데이터 저장 중 에러가 발생했습니다. 입력 내용을 확인 후 다시 시도해주세요.",
      });
    }
  };

  // 1번째 API 성공 후 2번째 API를 호출하는 예시
  const handleSequentialRequest = async () => {
    try {
      // 1. 첫 번째 API 호출 (포스트 등록)
      const newPost = await post("/posts", {
        title: "연쇄 호출 테스트용 제목",
        body: "첫 번째 API 호출 내용입니다.",
        userId: 1,
      });

      console.log("1번째 호출 성공:", newPost);

      // 2. 첫 번째 성공 후 두 번째 API 호출 (등록된 포스트의 댓글 가져오기)
      // JSONPlaceholder는 가짜 API이므로 실제 등록된 ID 대신 1번 포스트의 댓글을 조회해봅니다.
      const comments = await get(`/posts/1/comments`);

      console.log("2번째 호출 성공:", comments);

      Modal.success({
        title: "연쇄 호출 성공",
        content: "포스트 등록 후 댓글 목록 조회를 성공적으로 완료했습니다.",
      });
    } catch (err) {
      // 과정 중 하나라도 실패하면 이곳으로 들어옵니다.
      console.error("연쇄 호출 중 에러 발생:", err);
    } finally {
      // 성공하든 실패하든 무조건 실행되어야 하는 로직
      // 예: 로딩 스피너 종료, 로그 기록, 특정 플래그 리셋 등
      // setLoading(false);
      console.log("작업이 완료되었습니다.");
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title="Axios Hook 사용 샘플"
        extra={
          <Space>
            <Button onClick={handleSequentialRequest} loading={loading}>
              연쇄 호출 테스트
            </Button>
            <Button onClick={fetchPosts} loading={loading}>
              새로고침
            </Button>
          </Space>
        }
      >
        {loading && !data && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin tip="로딩 중..." />
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {!loading && data && (
          <List
            bordered
            dataSource={Array.isArray(data) ? data : [data]}
            renderItem={(item) => (
              <List.Item>
                <strong>{item.id}.</strong> {item.title}
              </List.Item>
            )}
          />
        )}

        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "20px",
          }}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="등록할 제목을 입력하세요"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              onPressEnter={createPost}
            />
            <Button type="primary" onClick={createPost} loading={loading}>
              전송 테스트
            </Button>
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
};

export default AxiosSample;
