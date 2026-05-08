CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL,
  permission_action_id UUID NOT NULL,
  code VARCHAR(200) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR (100),
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(100) ,
  CONSTRAINT fk_permissions_module
    FOREIGN KEY (module_id) REFERENCES modules(id),
  CONSTRAINT fk_permissions_permission_action
    FOREIGN KEY (permission_action_id) REFERENCES permission_actions(id),
  CONSTRAINT uq_permissions_module_action
    UNIQUE (module_id, permission_action_id)
);