-- 创建咨询信息表
CREATE TABLE IF NOT EXISTS consultation_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE consultation_submissions ENABLE ROW LEVEL SECURITY;

-- 创建允许插入的策略（允许任何人提交）
CREATE POLICY "Allow public insert" ON consultation_submissions
  FOR INSERT TO public
  WITH CHECK (true);

-- 创建允许查看数据的策略
CREATE POLICY "Allow view data" ON consultation_submissions
  FOR SELECT TO public
  USING (true);

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_consultation_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultation_submissions_updated_at
    BEFORE UPDATE ON consultation_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_consultation_updated_at_column();

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_created_at ON consultation_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_service_type ON consultation_submissions(service_type);