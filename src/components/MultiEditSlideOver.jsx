import { useEffect } from 'react'
import { Form, Select, Button, Tag, Typography, Divider, Space } from 'antd'
import { EditOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

const departmentOptions = [
  { label: '개발', value: 'engineering' },
  { label: '디자인', value: 'design' },
  { label: '마케팅', value: 'marketing' },
  { label: '인사', value: 'hr' },
  { label: '영업', value: 'sales' },
]

const skillOptions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Spring', value: 'spring' },
  { label: 'Figma', value: 'figma' },
  { label: 'Photoshop', value: 'photoshop' },
  { label: 'SEO', value: 'seo' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'Recruitment', value: 'recruitment' },
]

const statusOptions = [
  { label: '활성', value: 'active' },
  { label: '비활성', value: 'inactive' },
]

const departmentColorMap = {
  engineering: 'blue',
  design: 'purple',
  marketing: 'orange',
  hr: 'green',
  sales: 'cyan',
}

const getCommonValue = (rows, field) => {
  if (!rows.length) return undefined
  const values = rows.map((r) => JSON.stringify(r[field]))
  const unique = [...new Set(values)]
  return unique.length === 1 ? JSON.parse(unique[0]) : undefined
}

const hasMixedValues = (rows, field) => {
  if (!rows.length) return false
  const values = rows.map((r) => JSON.stringify(r[field]))
  return [...new Set(values)].length > 1
}

// Drawer 없이 인라인 사이드 패널로 렌더링
const MultiEditSlideOver = ({ open, selectedRows, onClose, onSave }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open || !selectedRows.length) return
    form.setFieldsValue({
      department: getCommonValue(selectedRows, 'department'),
      status: getCommonValue(selectedRows, 'status'),
      skills: getCommonValue(selectedRows, 'skills'),
    })
  }, [open, selectedRows, form])

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleSave = () => {
    const values = form.getFieldsValue()
    const changedValues = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== undefined),
    )
    onSave(changedValues)
    form.resetFields()
  }

  if (!open) return null

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* 헤더 */}
      <div className='flex items-center justify-between px-4 py-3 border-b bg-gray-50 shrink-0'>
        <Space>
          <EditOutlined className='text-blue-500' />
          <span className='font-semibold text-sm'>{selectedRows.length}개 항목 일괄 수정</span>
        </Space>
        <Button
          type='text'
          size='small'
          icon={<CloseOutlined />}
          onClick={handleClose}
        />
      </div>

      {/* 스크롤 가능한 본문 */}
      <div className='flex-1 overflow-y-auto px-4 py-3'>
        {/* 선택된 항목 목록 */}
        <div className='mb-3'>
          <Text type='secondary' className='text-xs font-medium uppercase tracking-wide'>
            선택된 항목
          </Text>
          <div className='flex flex-wrap gap-1 mt-2'>
            {selectedRows.map((row) => (
              <Tag key={row.id} color={departmentColorMap[row.department] ?? 'default'} className='text-xs'>
                {row.name}
              </Tag>
            ))}
          </div>
        </div>

        <Divider className='my-3' />

        <Text type='secondary' className='text-xs block mb-4 leading-relaxed'>
          변경한 필드만 선택된 모든 항목에 적용됩니다.
          <br />
          변경하지 않을 필드는 비워두세요.
        </Text>

        <Form form={form} layout='vertical' colon={false} size='small'>
          <Form.Item
            name='department'
            label={<span className='text-xs font-medium'>부서</span>}
            extra={
              hasMixedValues(selectedRows, 'department') && (
                <Text type='warning' className='text-xs'>여러 값 혼재</Text>
              )
            }
          >
            <Select
              placeholder={
                hasMixedValues(selectedRows, 'department')
                  ? '(여러 값) — 변경 시 선택'
                  : '부서 선택'
              }
              options={departmentOptions}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name='status'
            label={<span className='text-xs font-medium'>상태</span>}
            extra={
              hasMixedValues(selectedRows, 'status') && (
                <Text type='warning' className='text-xs'>여러 값 혼재</Text>
              )
            }
          >
            <Select
              placeholder={
                hasMixedValues(selectedRows, 'status')
                  ? '(여러 값) — 변경 시 선택'
                  : '상태 선택'
              }
              options={statusOptions}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name='skills'
            label={<span className='text-xs font-medium'>스킬</span>}
            extra={
              hasMixedValues(selectedRows, 'skills') && (
                <Text type='warning' className='text-xs'>여러 값 혼재</Text>
              )
            }
          >
            <Select
              mode='multiple'
              placeholder={
                hasMixedValues(selectedRows, 'skills')
                  ? '(여러 값) — 변경 시 선택'
                  : '스킬 선택'
              }
              options={skillOptions}
              allowClear
            />
          </Form.Item>
        </Form>

        <Divider className='my-3' />

        {/* 선택된 항목 상세 비교 테이블 */}
        <div>
          <Text type='secondary' className='text-xs font-medium uppercase tracking-wide'>
            선택 항목 상세
          </Text>
          <div className='mt-2 space-y-2'>
            {selectedRows.map((row) => {
              const deptOpt = departmentOptions.find((o) => o.value === row.department)
              const statusLabel = row.status === 'active' ? '활성' : '비활성'
              const skillLabels = Array.isArray(row.skills)
                ? row.skills.map((s) => skillOptions.find((o) => o.value === s)?.label ?? s).join(', ')
                : ''
              return (
                <div key={row.id} className='p-2 rounded border border-gray-100 bg-gray-50 text-xs'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-medium'>{row.name}</span>
                    <Tag color={departmentColorMap[row.department] ?? 'default'} className='text-xs m-0'>
                      {deptOpt?.label ?? row.department}
                    </Tag>
                    <Tag
                      color={row.status === 'active' ? 'success' : 'default'}
                      className='text-xs m-0'
                    >
                      {statusLabel}
                    </Tag>
                  </div>
                  <div className='text-gray-500 truncate'>{row.email}</div>
                  {skillLabels && (
                    <div className='text-gray-400 truncate mt-0.5'>스킬: {skillLabels}</div>
                  )}
                  {row.note && (
                    <div className='text-gray-400 truncate mt-0.5'>비고: {row.note}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className='shrink-0 border-t px-4 py-3 bg-gray-50 flex justify-end gap-2'>
        <Button size='small' onClick={handleClose}>취소</Button>
        <Button size='small' type='primary' onClick={handleSave}>저장</Button>
      </div>
    </div>
  )
}

export default MultiEditSlideOver
