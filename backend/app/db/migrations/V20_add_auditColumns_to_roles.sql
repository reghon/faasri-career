ALTER TABLE roles
ADD COLUMN created_by UUID REFERENCES users(id),
ADD COLUMN updated_by UUID REFERENCES users(id),
ADD COLUMN deleted_by UUID REFERENCES users(id);