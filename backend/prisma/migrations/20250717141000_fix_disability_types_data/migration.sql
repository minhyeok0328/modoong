-- Clear existing disability types and insert new ones
DELETE FROM "disability_types";

-- Insert new disability types
INSERT INTO disability_types (code, name, created_at, updated_at) VALUES
('wheelchair', '휠체어를 사용해요', NOW(), NOW()),
('visual', '시각장애가 있어요', NOW(), NOW()),
('hearing', '청각장애가 있어요', NOW(), NOW()),
('physical', '지체장애가 있어요', NOW(), NOW()),
('intellectual_autism', '지적/자폐장애가 있어요', NOW(), NOW()),
('brain_lesion', '뇌병변장애가 있어요', NOW(), NOW());
