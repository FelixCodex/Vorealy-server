CREATE TABLE users (
  id BINARY(16) PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preferences JSON
);

CREATE TABLE workspaces (
  id BINARY(16) PRIMARY KEY,
  owner_id BINARY(16) NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon_id VARCHAR(10),
  color VARCHAR(7) DEFAULT '#4169E1',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  -- FOREIGN KEY icon_id REFERENCES icons(id)
);



CREATE TABLE workspace_members (
  id BINARY(16) PRIMARY KEY,
  workspace_id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  role TEXT CHECK( role IN ('admin', 'member', 'guest') ) DEFAULT 'guest',
  joined_at DATETIME NOT NULL,
  invited_by BINARY(16),
  PRIMARY KEY (workspace_id, user_id),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL
);



CREATE TABLE projects (
  id BINARY(16) PRIMARY KEY,
  workspace_id BINARY(16) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#4169E1',
  icon VARCHAR(100),
  
  visibility ENUM('public', 'private') DEFAULT 'public',

  features_enabled JSON,
  automation_rules JSON,  

  created_at DATETIME NOT NULL,
  created_by BINARY(16) NOT NULL,
  updated_at DATETIME NOT NULL,
  updated_by BINARY(16),
  completed_at DATETIME,
  
  estimated_hours FLOAT,

  working_days JSON,  
  working_hours JSON,  
  holidays JSON, 
  
  tags JSON,
  metadata JSON,

  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);




CREATE TABLE folders (
  id BINARY(16) PRIMARY KEY,
  project_id BINARY(16) NOT NULL, 
  workspace_id BINARY(16) NOT NULL, 
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  color VARCHAR(7) DEFAULT '#808080',  
  icon VARCHAR(100),                   
           
  is_private BOOLEAN DEFAULT FALSE,    

  automation_rules JSON,
  
  created_at DATETIME NOT NULL,
  created_by BINARY(16) NOT NULL,
  updated_at DATETIME NOT NULL,
  updated_by BINARY(16),
  
  metadata JSON,                      
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);






CREATE TABLE lists (
    id BINARY(16) PRIMARY KEY,
    name TEXT NOT NULL,
    color VARCHAR(7) DEFAULT '#808080'
    description TEXT,

    parent_id BINARY(16) NOT NULL,
    parent_type ENUM('project', 'folder') NOT NULL,
    workspace_id BINARY(16) NOT NULL,

    created_by BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    automation_rules JSON,

    assigned_to BINARY(16),

    default_states JSON DEFAULT "{'todo':{'name':'Todo','color':'#E74C3C'},'done':{'name':'Done','color':'#F39C12'}}",
    statuses JSON,

    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    is_private BOOLEAN DEFAULT FALSE,

    estimated_time INTEGER,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);





CREATE TABLE tasks(
    id BINARY(16) PRIMARY KEY,
    title TEXT NOT NULL,

    list_id BINARY(16) NOT NULL,
    workspace_id BINARY(16) NOT NULL,

    created_by BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    start_date DATE,
    end_date DATE,

    assigned_to BINARY(16),

    state TEXT DEFAULT 'todo',

    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    estimated_time INTEGER,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE subtasks(
    id BINARY(16) PRIMARY KEY,
    title TEXT NOT NULL,

    task_id BINARY(16) NOT NULL,
    workspace_id BINARY(16) NOT NULL,

    completed BOOLEAN DEFAULT false,

    created_by BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    start_date DATE,
    end_date DATE,

    assigned_to BINARY(16),

    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    estimated_time INTEGER,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);








CREATE TABLE custom_property_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL, 
  default_value TEXT,
  options TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE custom_property_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  definition_id INTEGER NOT NULL,
  entity_type ENUM('workspace', 'project', 'folder', 'list', 'task') NOT NULL, 
  entity_id BINARY(16) NOT NULL,
  value TEXT,
  is_inherited BOOLEAN DEFAULT FALSE,
  override_parent BOOLEAN DEFAULT FALSE,
  parent_entity_type TEXT,
  parent_entity_id BINARY(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (definition_id) REFERENCES custom_property_definitions(id) ON DELETE CASCADE,
  UNIQUE (definition_id, entity_type, entity_id)
);






CREATE TABLE change_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type ENUM('workspace', 'project', 'folder', 'list', 'task', 'custom_property') NOT NULL, 
  entity_id BINARY(16) NOT NULL,
  change_type ENUM('create', 'update', 'delete') NOT NULL,
  field_name TEXT, 
  old_value TEXT, 
  new_value TEXT, 
  user_id BINARY(16) NOT NULL, 
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  additional_info TEXT 
  FOREIGN KEY (user_id) REFERENCES users(id),
);

CREATE INDEX idx_change_history_entity ON change_history(entity_type, entity_id);
CREATE INDEX idx_change_history_user ON change_history(user_id);
CREATE INDEX idx_change_history_timestamp ON change_history(timestamp);






CREATE TABLE documents (
  id BINARY(16) PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  workspace_id BINARY(16) NOT NULL,
  parent_type ENUM('project', 'folder', 'list') NOT NULL,
  parent_id BINARY(16),
  created_by BINARY(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);


CREATE TABLE forms (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  elements JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  workspace_id BINARY(16) NOT NULL,
  project_id VARCHAR(255),
  created_by BINARY(16) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  version INT DEFAULT 1,
  INDEX idx_forms_workspace_id (workspace_id),
  INDEX idx_forms_project_id (project_id),
  INDEX idx_forms_created_by (created_by),
  INDEX idx_forms_is_active (is_active),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

CREATE TABLE form_submissions (
  id BINARY(16) PRIMARY KEY,
  form_id BINARY(16) NOT NULL,
  data JSON NOT NULL,
  submitted_by BINARY(16) NOT NULL,
  submitted_at DATETIME NOT NULL,
  status ENUM('submitted', 'reviewed', 'approved', 'rejected') DEFAULT 'submitted',
  INDEX idx_form_submissions_form_id (form_id),
  INDEX idx_form_submissions_submitted_by (submitted_by),
  INDEX idx_form_submissions_status (status),
  INDEX idx_form_submissions_submitted_at (submitted_at),
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id)
);




CREATE TABLE notifications (
  id VARCHAR(12) PRIMARY KEY,
  recipient_id BINARY(16) NOT NULL, 
  type TEXT CHECK( type IN ('invitation', 'task', 'mention', 'update', 'custom') ) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSON, 
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);




CREATE TABLE workspace_assignation (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    workspace_id BINARY(16) NOT NULL,
    parent_type TEXT CHECK( parent_type IN ('project', 'folder', 'list', 'task', 'subtask') ) NOT NULL,
    parent_id BINARY(16) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BINARY(16),
    
    UNIQUE(user_id, workspace_id, parent_type, parent_id),
    
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id, workspace_id) REFERENCES workspace_members(user_id, workspace_id) ON DELETE CASCADE
);

CREATE INDEX idx_workspace_assignation_workspace ON workspace_assignation(workspace_id);
CREATE INDEX idx_workspace_assignation_user ON workspace_assignation(user_id);
CREATE INDEX idx_workspace_assignation_parent ON workspace_assignation(parent_type, parent_id);
CREATE INDEX idx_workspace_assignation_assigned_by ON workspace_assignation(assigned_by);


CREATE TABLE workspace_invitations (
  id VARCHAR(12) PRIMARY KEY,
  workspace_id BINARY(16) NOT NULL,
  invited_user_id BINARY(16) NOT NULL,
  invited_by_user_id BINARY(16) NOT NULL,     
  status TEXT CHECK( status IN ('pending', 'accepted') ) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  expires_at TIMESTAMP,                 
  role TEXT CHECK( role IN ('admin', 'member', 'guest') ) DEFAULT 'member',
  message TEXT DEFAULT NULL,                            
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);








CREATE TABLE chat_conversations (
  id VARCHAR(36) PRIMARY KEY,
  workspace_id BINARY(16) NOT NULL,
  parent_id BINARY(16) NOT NULL,
  parent_type TEXT CHECK( parent_type IN ('project', 'folder', 'list') ) NOT NULL,
  name VARCHAR(255),
  description TEXT,
  type TEXT CHECK( type IN ('group', 'ai', 'direct') ) DEFAULT 'group',
  is_active BOOLEAN DEFAULT TRUE,
  created_by BINARY(16) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  
  INDEX idx_parent (parent_id, parent_type),
  INDEX idx_created_by (created_by),
  INDEX idx_active (is_active),
  INDEX idx_type (type)
);


CREATE TABLE chat_messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  sender_id BINARY(16), 
  sender_type TEXT CHECK( sender_type IN ('user', 'ai') ) DEFAULT 'user',
  message TEXT NOT NULL,
  metadata JSON, 
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at DATETIME NULL,
  reply_to_id VARCHAR(36) NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL,
  
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_sender_type (sender_type),
  INDEX idx_created_at (created_at),
  INDEX idx_reply_to (reply_to_id)
);